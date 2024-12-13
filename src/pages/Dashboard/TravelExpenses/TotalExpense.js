import { Table } from 'components';
import moment from 'moment';
import useMain from 'pages/context/context';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { getTeTotals } from 'supabase/travelExpenses';
import Project from './Project';
import {  useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const headerCol = [
  'Lodging days requested',
  'Meals requested',
  'Lodgings expenses (₩)',
  'Meals expenses (₩)',
  'Processing cost',
  'Travel exps. totals (₩)',
  'Overtime requested',
  'Rest day move & Nightime',
  'Overtime (100k)',
  'Rest day move & Nightime (40k)',
  'Processing cost (₩)',
  'Overtime exps. totals (₩)',
];

const _month = moment().format('MMM, YYYY');
const mainCol = [
  { name: `Travel expences totals  ${_month}`, col: 6 },
  { name: `Overtime expences totals  ${_month}`, col: 6 },
];

const createRow = (resources) => {
  const updatedResources = resources.map((project) => ({
    ...project,
    id: String(project.id),
    name: project.projectTitle,
    children: project.children.map((team) => {
      const teamEmployees = [];
      team.rightIcon =
        team.team_type === 'InHome' ? 'material-symbols:home-outline-rounded' : 'material-symbols:handshake-outline';
      const updatedEmployees = team.children.map((employee) => {
        teamEmployees.push({ id: String(employee.id), name: employee.name });
        return {
          ...employee,
          id: String(employee.id),
          collapsed: true,
          rightIcon: 'material-symbols:person-outline-rounded',
        };
      });
      return {
        ...team,
        children: updatedEmployees,
      };
    }),
  }));
  return updatedResources;
};

export default function CollapsibleTable() {
  const { state } = useMain();
  const { dateRange } = state.filters || {};
  const { id } = useParams();
  const { t } = useTranslation(['travel_expenses'])

  const [rows, setrows] = useState([]);
  const fetchTotals = async (id) => {
    const resources = await getTeTotals(dateRange,id);
    setrows(createRow(resources));
  };

  useEffect(() => {
    fetchTotals(id);
  }, []);

  return (
    <Table
      mainCol={mainCol}
      headerCol={headerCol}
      rows={rows}
      startRow={<Project t={t} />}
      className="travelExpense"
      rowLength={12}
      t={t}
    />
  );
}
