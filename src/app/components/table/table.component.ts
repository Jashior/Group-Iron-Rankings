import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y/input-modality/input-modality-detector';
import { DataSource } from '@angular/cdk/collections';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PlayerLoadService } from '../../shared/player-load.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit, AfterViewInit {
  loading = false;
  displayedColumns: string[] = [
    'position',
    'rsn',
    'total',
    'groupname',
    'groupsize',
  ];
  statsList = [
    'total',
    'Attack',
    'Strength',
    'Defence',
    'Hitpoints',
    'Prayer',
    'Magic',
    'Ranged',
    'Runecraft',
    'Construction',
    'Agility',
    'Herblore',
    'Thieving',
    'Crafting',
    'Fletching',
    'Slayer',
    'Hunter',
    'Mining',
    'Smithing',
    'Fishing',
    'Cooking',
    'Firemaking',
    'Woodcutting',
    'Farming',
  ];

  GIM_DATA: any = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.GIM_DATA);
  COPY;
  currentFilter = 'ALL';
  filterText = '';
  exactFilterFlag = false;
  basePredicate;
  skillSort = 'total';
  currentGroupSize = 0;
  playerStatsView = false;
  nameSelected = '';
  selectedPlayerStats = {};

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private playerLoadService: PlayerLoadService) {
    this.loading = true;
    this.playerLoadService.getPlayers().subscribe((data: []) => {
      this.GIM_DATA = data;
      this.GIM_DATA = this.GIM_DATA.sort(
        (a, b) => b.total - a.total || b.totalexp - a.totalexp
      );
      this.displayedColumns = [
        'position',
        'rsn',
        'total',
        'totalexp',
        'groupname',
        'groupsize',
      ];
      for (let i = 0; i < this.GIM_DATA.length; i++) {
        this.GIM_DATA[i].position = i + 1;
      }
      this.COPY = JSON.parse(JSON.stringify(this.GIM_DATA));
      this.dataSource = new MatTableDataSource(this.GIM_DATA);
      this.basePredicate = this.createFilter();
      if (this.GIM_DATA.length > 1260) {
        this.loading = false;
      }
      this.dataSource.paginator = this.paginator;
    });
  }

  compare(a, b) {
    if (a.total < b.total) {
      return -1;
    }
    if (a.total > b.total) {
      return 1;
    }
    return 0;
  }

  loadData = () => {};

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {}

  printer() {
    console.log(`exact filtering: ${this.exactFilterFlag}`);
  }

  applyFilter(event: Event) {
    this.disablePlayerStatsView();
    const filterValue = (event.target as HTMLInputElement).value;
    this.resetFilterPredicate();
    this.exactFilterFlag = false;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // on x click reset
  resetTextFilter() {
    this.disablePlayerStatsView();
    this.filterText = '';
    const filterValue = '';
    this.resetFilterPredicate();
    this.exactFilterFlag = false;
    this.currentGroupSize = 0;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // filter the set based on groupsize, if you've clicked on a groupname do EXACT match
  filterSet(size) {
    if (this.playerStatsView == false) {
      this.disablePlayerStatsView();
    }
    this.currentFilter = size;
    let filtered = [];
    filtered = this.COPY;

    if (size == 'ALL') {
      // add size column if ALL size
      if (this.displayedColumns.indexOf('groupsize') == -1) {
        this.displayedColumns = [...this.displayedColumns, 'groupsize'];
      }
    } else {
      // remove size column if filtered size
      this.displayedColumns = this.displayedColumns.filter(
        (x) => x !== 'groupsize'
      );

      let n = Number(size);
      filtered = filtered.filter((player) => {
        if (player.groupsize == n) {
          return { ...player };
        }
      });
    }

    for (let i = 0; i < filtered.length; i++) {
      filtered[i].position = i + 1;
    }

    this.dataSource = new MatTableDataSource(filtered);
    this.dataSource.paginator = this.paginator;
    // Incase search text is still in box
    const filterValue = this.filterText;

    if (this.exactFilterFlag) {
      this.exactFilterPredicate();
    } else {
      this.resetFilterPredicate();
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // if clicked on a groupname
  filterByGroupName(groupName) {
    this.disablePlayerStatsView();
    this.filterText = groupName;
    const filterValue = this.filterText;
    this.exactFilterPredicate();
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.currentGroupSize = this.dataSource.filteredData[0]['groupsize'];
  }

  // if clicked on a groupname, searches exactly that name only to get all members:
  exactFilterPredicate() {
    this.exactFilterFlag = true;
    this.dataSource.filterPredicate = function (data, filterValue) {
      return data['groupname'].trim().toLocaleLowerCase() === filterValue;
    };
  }

  // results back to the base predicate if you change from clicking on a groupname to typing search again
  resetFilterPredicate() {
    this.dataSource.filterPredicate = this.basePredicate;
  }

  // default filter searches rsn and groupname only
  private createFilter() {
    let filterFunction = function (data, filter): boolean {
      if (
        data['groupname'].toLocaleLowerCase().indexOf(filter) !== -1 ||
        data['rsn'].toLocaleLowerCase().indexOf(filter) !== -1
      ) {
        return true;
      } else {
        return false;
      }
    };

    return filterFunction;
  }

  sortBy(field) {
    if (!this.playerStatsView) {
      this.disablePlayerStatsView();
    }
    this.skillSort = field;
    this.loading = true;
    let fieldExp = field + 'Exp';
    if (field == 'total') {
      fieldExp = field + 'exp';
    }

    let filtered = this.COPY;
    filtered = filtered.sort(
      (a, b) => b[field] - a[field] || b[fieldExp] - a[fieldExp]
    );

    if (this.currentFilter == 'ALL') {
      this.displayedColumns = [
        'position',
        'rsn',
        field,
        fieldExp,
        'groupname',
        'groupsize',
      ];
    } else {
      this.displayedColumns = ['position', 'rsn', field, fieldExp, 'groupname'];

      filtered = filtered.filter((player) => {
        if (player.groupsize == this.currentFilter) {
          return { ...player };
        }
      });
    }

    for (let i = 0; i < filtered.length; i++) {
      filtered[i].position = i + 1;
    }
    this.dataSource = new MatTableDataSource(filtered);
    this.basePredicate = this.createFilter();

    if (this.exactFilterFlag) {
      this.exactFilterPredicate();
    }

    const filterValue = this.filterText;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.paginator = this.paginator;
    this.loading = false;
  }

  disablePlayerStatsView() {
    this.playerStatsView = false;
    this.nameSelected = '';
    this.selectedPlayerStats = {};
  }
  showStats(name) {
    console.log(
      `Comparing name ${name} with name selected ${this.nameSelected} == ${
        name == this.nameSelected
      }`
    );

    if (name == this.nameSelected) {
      this.disablePlayerStatsView();
      return;
    }
    this.filterText = name;
    this.playerStatsView = true;
    this.nameSelected = name;
    for (let i = 0; i < this.dataSource.filteredData.length; i++) {
      let playerPicked = this.dataSource.filteredData[i];
      if (playerPicked['rsn'] == name) {
        this.currentGroupSize = playerPicked['groupsize'];
        for (let j = 0; j < this.statsList.length; j++) {
          this.selectedPlayerStats[this.statsList[j]] =
            playerPicked[this.statsList[j]];
        }
        this.sortBy(this.skillSort);
        return;
      }
    }
  }
}
