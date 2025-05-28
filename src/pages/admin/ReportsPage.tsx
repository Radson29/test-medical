import React, { useState } from 'react';
import { FileText, Download, BarChart, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

const reports = [
  {
    id: 'appointments',
    title: 'Raport wizyt',
    description: 'Zestawienie wszystkich wizyt w wybranym okresie',
    icon: Calendar,
  },
  {
    id: 'doctors',
    title: 'Raport lekarzy',
    description: 'Statystyki pracy lekarzy i obłożenia',
    icon: Users,
  },
  {
    id: 'patients',
    title: 'Raport pacjentów',
    description: 'Analiza aktywności pacjentów',
    icon: Users,
  },
  {
    id: 'statistics',
    title: 'Statystyki ogólne',
    description: 'Ogólne statystyki systemu',
    icon: BarChart,
  },
];

const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('appointments');
  const [dateRange, setDateRange] = useState('last30');
  const [format, setFormat] = useState('pdf');

  const handleGenerateReport = () => {
    // In a real app, this would generate and download the report
    console.log('Generating report:', {
      report: selectedReport,
      dateRange,
      format,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <FileText className="h-6 w-6 mr-2" />
          Raporty
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map((report) => (
          <Card
            key={report.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedReport === report.id
                ? 'ring-2 ring-primary-500 shadow-lg'
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedReport(report.id)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <report.icon className={`h-8 w-8 ${
                  selectedReport === report.id
                    ? 'text-primary-500'
                    : 'text-neutral-500'
                }`} />
                <h3 className="mt-4 font-medium">{report.title}</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  {report.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parametry raportu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Zakres dat"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              options={[
                { value: 'today', label: 'Dzisiaj' },
                { value: 'last7', label: 'Ostatnie 7 dni' },
                { value: 'last30', label: 'Ostatnie 30 dni' },
                { value: 'thisMonth', label: 'Ten miesiąc' },
                { value: 'lastMonth', label: 'Poprzedni miesiąc' },
                { value: 'thisYear', label: 'Ten rok' },
              ]}
            />

            <Select
              label="Format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              options={[
                { value: 'pdf', label: 'PDF' },
                { value: 'excel', label: 'Excel' },
                { value: 'csv', label: 'CSV' },
              ]}
            />

            <div className="flex items-end">
              <Button
                className="w-full"
                onClick={handleGenerateReport}
                icon={<Download className="h-4 w-4" />}
              >
                Generuj raport
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import / Export danych</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Import danych</h3>
              <p className="text-sm text-neutral-500 mb-4">
                Zaimportuj dane z pliku CSV lub Excel
              </p>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  className="block w-full text-sm text-neutral-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-neutral-50 file:text-neutral-700
                    hover:file:bg-neutral-100"
                />
                <Button variant="outline">
                  Importuj
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Export danych</h3>
              <p className="text-sm text-neutral-500 mb-4">
                Wyeksportuj wszystkie dane systemu
              </p>
              <Select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                options={[
                  { value: 'excel', label: 'Excel' },
                  { value: 'csv', label: 'CSV' },
                ]}
              />
              <Button className="mt-2">
                Eksportuj dane
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;