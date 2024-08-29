"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables, ChartType } from 'chart.js';
import Cookies from 'js-cookie'; // Import js-cookie
import { toast } from 'react-toastify'; // Import toast
import { LoginPage } from "../../components/ui/login/login"; // Named import

Chart.register(...registerables);

const Graph: React.FC = () => {
  const [genderData, setGenderData] = useState<{ [key: string]: number }>({});
  const [departmentData, setDepartmentData] = useState<{ [key: string]: number }>({});
  const [yearData, setYearData] = useState<{ [key: number]: number }>({});
  const [semesterData, setSemesterData] = useState<{ [key: number]: number }>({});
  const [domainData, setDomainData] = useState<{ [key: string]: number }>({});
  const [sectionData, setSectionData] = useState<{ [key: string]: number }>({});
  const [branchData, setBranchData] = useState<{ [key: string]: number }>({});
  const [totalEntries, setTotalEntries] = useState<number>(0); // Total entries count
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const genderChartRef = useRef<HTMLCanvasElement>(null);
  const departmentChartRef = useRef<HTMLCanvasElement>(null);
  const yearChartRef = useRef<HTMLCanvasElement>(null);
  const semesterChartRef = useRef<HTMLCanvasElement>(null);
  const domainChartRef = useRef<HTMLCanvasElement>(null);
  const sectionChartRef = useRef<HTMLCanvasElement>(null);
  const branchChartRef = useRef<HTMLCanvasElement>(null);
  const totalEntriesChartRef = useRef<HTMLCanvasElement>(null);

  // Updated colors for year
  const yearColors: { [key: number]: string } = {
    1: "#1d4ed8", // Blue
    2: "#22c55e", // Green
    3: "#eab308", // Yellow
    4: "#f97316", // Orange
    5: "#ef4444", // Red
  };

  // Updated colors for semester
  const semesterColors: { [key: number]: string } = {
    1: "#3b82f6", // Sky Blue
    2: "#34d399", // Light Green
    3: "#fbbf24", // Gold
    4: "#fb923c", // Light Orange
    5: "#06b6d4", // Teal
    6: "#9333ea", // Purple
    7: "#ec4899", // Pink
    8: "#6b7280", // Gray
  };

  // Updated colors for departments
  const departmentColors: { [key: string]: string } = {
    DSBS: "#5eead4",   // Teal
    Cintel: "#67e8f9", // Cyan
    "C-Tech": "#d9f99d", // Light Green
    NWC: "#fca5a1",    // Light Red
    Other: "#a5b4fc",  // Light Purple
  };

  // Added colors for gender
  const genderColors: { [key: string]: string } = {
    Male: "#1E90FF",  // Blue
    Female: "#FF69B4", // Pink
  };

  // Added colors for domain
  const domainColors: { [key: string]: string } = {
    "Web/App Development": "#5eead4",   // Teal
    "Research & Development": "#67e8f9",          // Cyan
    "Corporate": "#d9f99d",                 // Light Green
    "Creatives": "#fca5a1",        // Light Red
    Other: "#a5b4fc",                   // Light Purple
  };

  // Added colors for section
  const sectionColors: { [key: string]: string } = {
    AD1: "#5eead4",  // Teal
    AD2: "#67e8f9",  // Cyan
    AD3: "#d9f99d",  // Light Green
    AD4: "#fca5a1",  // Light Red
    Other: "#a5b4fc", // Light Purple
  };

  // Added colors for branch
  const branchColors: { [key: string]: string } = {
    "CSE w/s Big Data Analytics": "#5eead4",   // Teal
    "CSE w/s AI/ML": "#67e8f9",                // Cyan
    "CSE w/s Cyber Security": "#d9f99d",       // Light Green
    Other: "#fca5a1",                          // Light Red
  };

  useEffect(() => {
    // Check if the cookie is set
    const loggedIn = Cookies.get('loggedIn');
    setIsLoggedIn(!!loggedIn); // Set the state based on cookie presence
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL as string);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const genderCounts: { [key: string]: number } = {};
        const departmentCounts: { [key: string]: number } = {};
        const yearCounts: { [key: number]: number } = {};
        const semesterCounts: { [key: number]: number } = {};
        const domainCounts: { [key: string]: number } = {};
        const sectionCounts: { [key: string]: number } = {};
        const branchCounts: { [key: string]: number } = {};

        data.forEach((item: { gender: string; department: string; year: number; semester: number; domain: string; section: string; branch: string }) => {
          genderCounts[item.gender] = (genderCounts[item.gender] || 0) + 1;
          departmentCounts[item.department] = (departmentCounts[item.department] || 0) + 1;
          yearCounts[item.year] = (yearCounts[item.year] || 0) + 1;
          semesterCounts[item.semester] = (semesterCounts[item.semester] || 0) + 1;
          domainCounts[item.domain] = (domainCounts[item.domain] || 0) + 1;
          sectionCounts[item.section] = (sectionCounts[item.section] || 0) + 1;
          branchCounts[item.branch] = (branchCounts[item.branch] || 0) + 1;
        });

        setGenderData(genderCounts);
        setDepartmentData(departmentCounts);
        setYearData(yearCounts);
        setSemesterData(semesterCounts);
        setDomainData(domainCounts);
        setSectionData(sectionCounts);
        setBranchData(branchCounts);
        setTotalEntries(data.length);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const createChart = (ref: React.RefObject<HTMLCanvasElement>, type: ChartType, data: any, options: any) => {
      if (ref.current) {
        return new Chart(ref.current, {
          type, // ChartType is now correctly typed
          data,
          options,
        });
      }
    };

    const genderChart = createChart(genderChartRef, 'bar', {
      labels: Object.keys(genderData),
      datasets: [{
        data: Object.values(genderData),
        backgroundColor: Object.keys(genderData).map(gender => genderColors[gender] || "#ccc"),
      }],
    }, {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          ticks: {
            stepSize: 1, // Set y-axis ticks to increment by 1
          },
        },
      },
    });

    const departmentChart = createChart(departmentChartRef, 'bar', {
      labels: Object.keys(departmentData),
      datasets: [{
        label: 'Number of Users',
        data: Object.values(departmentData),
        backgroundColor: Object.keys(departmentData).map(dept => departmentColors[dept] || "#ccc"),
      }],
    }, {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          ticks: {
            stepSize: 1, // Set y-axis ticks to increment by 1
          },
        },
      },
    });

    const yearChart = createChart(yearChartRef, 'bar', {
      labels: Object.keys(yearData),
      datasets: [{
        data: Object.values(yearData),
        backgroundColor: Object.keys(yearData).map(year => yearColors[Number(year)] || "#ccc"),
      }],
    }, {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          ticks: {
            stepSize: 1, // Set y-axis ticks to increment by 1
          },
        },
      },
    });

    const semesterChart = createChart(semesterChartRef, 'bar', {
      labels: Object.keys(semesterData),
      datasets: [{
        data: Object.values(semesterData),
        backgroundColor: Object.keys(semesterData).map(sem => semesterColors[Number(sem)] || "#ccc"),
      }],
    }, {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          ticks: {
            stepSize: 1, // Set y-axis ticks to increment by 1
          },
        },
      },
    });

    const domainChart = createChart(domainChartRef, 'bar', {
      labels: Object.keys(domainData),
      datasets: [{
        label: 'Number of Users',
        data: Object.values(domainData),
        backgroundColor: Object.keys(domainData).map(domain => domainColors[domain] || "#ccc"),
      }],
    }, {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          ticks: {
            stepSize: 1, // Set y-axis ticks to increment by 1
          },
        },
      },
    });

    const sectionChart = createChart(sectionChartRef, 'bar', {
      labels: Object.keys(sectionData),
      datasets: [{
        label: 'Number of Users',
        data: Object.values(sectionData),
        backgroundColor: Object.keys(sectionData).map(section => sectionColors[section] || "#ccc"),
      }],
    }, {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          ticks: {
            stepSize: 1, // Set y-axis ticks to increment by 1
          },
        },
      },
    });

    const branchChart = createChart(branchChartRef, 'bar', {
      labels: Object.keys(branchData),
      datasets: [{
        label: 'Number of Users',
        data: Object.values(branchData),
        backgroundColor: Object.keys(branchData).map(branch => branchColors[branch] || "#ccc"),
      }],
    }, {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          ticks: {
            stepSize: 1, // Set y-axis ticks to increment by 1
          },
        },
      },
    });

    const totalEntriesChart = createChart(totalEntriesChartRef, 'bar', {
      labels: ['Total Entries'],
      datasets: [{
        data: [totalEntries],
        backgroundColor: ["#57abd7"], // Gray
      }],
    }, {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          ticks: {
            stepSize: 1, // Set y-axis ticks to increment by 1
          },
        },
      },
    });

    return () => {
      genderChart?.destroy();
      departmentChart?.destroy();
      yearChart?.destroy();
      semesterChart?.destroy();
      domainChart?.destroy();
      sectionChart?.destroy();
      branchChart?.destroy();
      totalEntriesChart?.destroy();
    };
  }, [genderData, departmentData, yearData, semesterData, domainData, sectionData, branchData, totalEntries]);

  const handleDownloadAll = () => {
    const downloadChart = (chartRef: React.RefObject<HTMLCanvasElement>, filename: string) => {
      if (chartRef.current) {
        const link = document.createElement('a');
        link.href = chartRef.current.toDataURL('image/png');
        link.download = `${filename}.png`;
        link.click();
      }
    };

    downloadChart(genderChartRef, 'gender-distribution');
    downloadChart(departmentChartRef, 'department-distribution');
    downloadChart(yearChartRef, 'year-distribution');
    downloadChart(semesterChartRef, 'semester-distribution');
    downloadChart(domainChartRef, 'domain-distribution');
    downloadChart(sectionChartRef, 'section-distribution');
    downloadChart(branchChartRef, 'branch-distribution');
    downloadChart(totalEntriesChartRef, 'total-entries');
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {loading ? (
        <>
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md animate-pulse">
              <div className="h-48 bg-gray-700 rounded-lg"></div>
              <h2 className="text-lg font-semibold mb-2 mt-2">Loading...</h2>
            </div>
          ))}
        </>
      ) : (
        <>
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Gender Distribution</h2>
            <canvas ref={genderChartRef}></canvas>
          </div>
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Department Distribution</h2>
            <canvas ref={departmentChartRef}></canvas>
          </div>
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Year Distribution</h2>
            <canvas ref={yearChartRef}></canvas>
          </div>
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Semester Distribution</h2>
            <canvas ref={semesterChartRef}></canvas>
          </div>
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Domain Distribution</h2>
            <canvas ref={domainChartRef}></canvas>
          </div>
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Section Distribution</h2>
            <canvas ref={sectionChartRef}></canvas>
          </div>
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Branch Distribution</h2>
            <canvas ref={branchChartRef}></canvas>
          </div>
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Total Entries</h2>
        <canvas ref={totalEntriesChartRef}></canvas>
      </div>
        </>
      )}
      <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center">
        <button
          onClick={handleDownloadAll}
          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
        >
          Download All Charts
        </button>
      </div>
    </div>
  );
};

export default Graph;
