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

      if (this.GIM_DATA.length > 750) {
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
    console.log(this.GIM_DATA[1]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterSet(size) {
    this.currentFilter = size;
    let filtered = [];
    if (size == 'ALL') {
      filtered = this.COPY;
    } else {
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
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
