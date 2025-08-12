import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import {
  ApexChart,
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  NgApexchartsModule,
  ChartComponent,
  ApexResponsive,
} from 'ng-apexcharts';
import { ApiService } from '../../../../services/api-service';

type ApexXAxis = {
  type?: 'category' | 'datetime' | 'numeric';
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

export type ChartOptionsPie = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  colors: any;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels; // ← Cambiar de 'any' a 'ApexDataLabels'
};

export type ChartOptionsLine = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
   colors: any;
};

@Component({
  selector: 'app-dashboard-component',
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.scss',
})
export default class DashboardComponent {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  // Pie chart
  @ViewChild('chartPie') chartPie: ChartComponent;
  public chartOptions2: Partial<ChartOptionsPie>;

  // Pie Line
  @ViewChild('chartLine') chartLine: ChartComponent;
  public chartOptions3: Partial<ChartOptionsLine>;

  clientes: any = [];
  citas: any = [];

  constructor(private api: ApiService) {
    this.chartOptions = {
      series: [
        {
          name: 'distibuted',
          data: [4, 6, 10, 8],
        },
      ],
      chart: {
        height: 220,
        type: 'bar',
        events: {
          click: function (chart, w, e) {
            // console.log(chart, w, e)
          },
        },
      },
      colors: [
        '#E02424',
        '#E02424',
        '#E02424',
        '#E02424',
        // "#E02424",
      ],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
      title: {
        text: 'Estado de las citas - Agosto',
        margin: 25,
        align: 'left',
        style: {
          fontSize: '14px',
          fontWeight: 'semibold',
          fontFamily: 'Poppins',
          color: '#374151',
        },
      },
      xaxis: {
        categories: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        labels: {
          style: {
            colors: [
              '#6B7280',
              '#6B7280',
              '#6B7280',
              '#6B7280',
              // "#6B7280",
            ],
            fontSize: '12px',
          },
        },
      },
    };

    this.chartOptions2 = {
      series: [1, 2, 3, 4, 5],
      chart: {
        type: 'donut',
      },
      dataLabels: {
        enabled: false, // Esto quita completamente los % de las franjas
      },

      labels: {
        style: {
          colors: ['#0E9F6E', '#C27803', '#F05252', '#3F83F8', '#775DD0'],
          fontSize: '10px',
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 350,
              // height:100
            },
            legend: {
              position: 'bottom',
            },
          },
        },
        {
          breakpoint: 1024,
          options: {
            chart: {
              width: 380,
              height: 380,
            },
            legend: {
              position: 'right',
            },
          },
        },
        {
          breakpoint: 1367,
          options: {
            chart: {
              width: 300,
              height: 300,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
        {
          breakpoint: 1921,
          options: {
            chart: {
              width: 300,
              height: 300,
            },
            legend: {
              position: 'right',
            },
          },
        },
      ],
      title: {
        text: 'Citas por semana - Agosto',
        margin: 25,
        align: 'left',
        style: {
          fontSize: '14px',
          fontWeight: 'semibold',
          fontFamily: 'Poppins',
          color: '#374151',
        },
      },
      fill: {
        colors: [
          '#FBBE24', //amarillo
          '#EF4444', //rojo
          '#f97416', //tomate
          '#0EA2F9', //azul
          '#4caf50', //verde
          // FFFFFF
        ],
      },
      colors: [
        '#FBBE24', //amarillo
        '#EF4444', //rojo
        '#f97416', //tomate
        '#0EA2F9', //azul
        '#4caf50', //verde
      ],

      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          expandOnClick: true,
          offsetX: 0,
          offsetY: 0,
          customScale: 1,
          dataLabels: {
            offset: 0,
            minAngleToShowLabel: 10,
          },
          donut: {
            size: '80%',
            background: '#ffffff',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '22px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                color: 'undefined',
                offsetY: 25,
              },

              total: {
                show: true,
                showAlways: false,
                label: 'Total de citas',
                fontSize: '15px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 500,
                color: '#373d3f',
              },
              value: {
                show: true,
                fontSize: '35px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 500,
                color: '#4B5563',
                offsetY: -16,
              },
            },
          },
        },
      },
    };

    this.chartOptions3 = {
      series: [
        {
          name: 'Desktops',
          data: [4, 6 ,3 ,6 ,7 ,4 ,5,4],
        },
      ],
      chart: {
        height: 295,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
            colors: [
        '#f97416',
        // "#E02424",
      ],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'straight',

      },

      title: {
        text: 'Citas por hora del día - Agosto',
        margin: 25,
        align: 'left',
        style: {
          fontSize: '14px',
          fontWeight: 'semibold',
          fontFamily: 'Poppins',
          color: '#374151',
        },
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          '8:00',
          '9:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
          '14:00',
          '15:00',
          '16:00',
        ],
      },
    };
  }

  ngOnInit() {
    // this.getClientes();
    this.getCitas();
  }

  getClientes() {
    this.api.getClientes().subscribe({
      next: (resp: any) => {
        // console.log('resp', resp);

        for (let i = 0; i < 5; i++) {
          const element = resp[i];
          this.clientes.push(element);
        }

        console.log('Elementos', this.clientes);
      },
    });
  }

  getCitas() {
    this.api.getCitas().subscribe({
      next: (resp: any) => {
        // console.log('resp', resp);

        for (let i = 0; i < 5; i++) {
          const element = resp[i];
          this.citas.push(element);
        }

        console.log('Elementos', this.citas);
      },
    });
  }

  getStatusClass(status: string): string {
    return this.api.getStatusClass(status);
  }
}
