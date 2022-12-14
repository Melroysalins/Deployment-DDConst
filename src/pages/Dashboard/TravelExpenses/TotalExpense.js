import { Table } from 'components';
import * as React from 'react';
import { dummyArrayNumber } from 'utils/helper';
import Project from './Project';

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
const mainCol = [
  { name: 'Travel expences totals (April, 2022)', col: 6 },
  { name: 'Overtime expences totals (April, 2022)', col: 6 },
];

const rows = [
  { name: '민수 위탁 154kV 고덕2-평택,동평택 인출정비공사 (일진)', hasDetail: false, values: dummyArrayNumber(12) },
  {
    name: '설치팀1',
    hasDetail: true,
    rightIcon: 'fluent-mdl2:home',
    leftImg: '',
    values: dummyArrayNumber(12),
    detail: [
      {
        name: 'Employee_LGS',
        rightIconText: 'Team Lead',
        leftImg: `/static/mock-images/avatars/avatar_4.jpg`,
        values: dummyArrayNumber(12),
      },
      {
        name: '이준호',
        rightIconText: 'C',
        leftImg: `/static/mock-images/avatars/avatar_6.jpg`,
        values: dummyArrayNumber(12),
      },
    ],
  },
  {
    name: 'Transmission line 154kV power cable installation work',
    hasDetail: true,
    values: dummyArrayNumber(12),
    detail: [
      { name: 'Random value 1', values: dummyArrayNumber(12) },
      { name: '이준호 2', values: dummyArrayNumber(12) },
    ],
  },
  {
    name: '154kV Godeok 2-Pyeongtaek, Dongpyeongtaek withdrawal maintenance work',
    rightIcon: 'material-symbols:handshake-outline',
    leftImg: '',
    values: dummyArrayNumber(12),
  },
];

export default function CollapsibleTable() {
  return <Table mainCol={mainCol} headerCol={headerCol} rows={rows} startRow={<Project />} className="totalExpense" />;
}
