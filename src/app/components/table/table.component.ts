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
  GIM_DATA: any = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.GIM_DATA);
  COPY;
  currentFilter = 'ALL';
  filterText = '';
  exactFilterFlag = false;
  basePredicate;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private playerLoadService: PlayerLoadService) {
    this.loading = true;
    console.log(this.playerLoadService.testMessage());
    this.playerLoadService.getPlayers().subscribe((data: []) => {
      this.GIM_DATA = data;
      this.GIM_DATA = this.GIM_DATA.sort((a, b) => b.total - a.total);

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
    const filterValue = (event.target as HTMLInputElement).value;
    this.resetFilterPredicate();
    this.exactFilterFlag = false;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // on x click reset
  resetTextFilter() {
    this.filterText = '';
    const filterValue = '';
    this.resetFilterPredicate();
    this.exactFilterFlag = false;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // filter the set based on groupsize, if you've clicked on a groupname do EXACT match
  filterSet(size) {
    this.currentFilter = size;
    let filtered = [];
    if (size == 'ALL') {
      // add size column if ALL size
      this.displayedColumns = [
        'position',
        'rsn',
        'total',
        'groupname',
        'groupsize',
      ];

      filtered = this.COPY;
    } else {
      // remove size column if filtered size
      this.displayedColumns = ['position', 'rsn', 'total', 'groupname'];

      let n = Number(size);
      filtered = this.COPY.filter((player) => {
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
    this.filterText = groupName;
    const filterValue = this.filterText;
    this.exactFilterPredicate();
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
}
