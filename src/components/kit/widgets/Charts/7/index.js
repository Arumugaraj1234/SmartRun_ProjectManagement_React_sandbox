import React, { useState } from 'react'
import { Table, Input } from 'antd'
import { VectorMap } from 'react-jvectormap'
import data from './data.json'
import style from './style.module.scss'


const Chart7 = () => {
  const [value, setValue] = useState('');
  const [dataSource, setDataSource] = useState(data.table);
  const FilterByNameInput = (
    <Input
      placeholder="Search Name"
      value={value}
      onChange={e => {
        const currValue = e.target.value;
        setValue(currValue);
        const filteredData = data.table.filter(entry =>
          entry.location.includes(currValue)
        );
        setDataSource(filteredData);
      }}
    />
  );
  const columns = [
    {
      title: '',
      dataIndex: 'actionName',
      key: 'actionName',
      className: 'bg-transparent text-gray-6',
    },
    {
      title: FilterByNameInput,
      dataIndex: 'location',
      key: 'location',
      className: 'bg-transparent text-gray-6',
      render: text => {
        return <a className="text-blue">{text}</a>
      },
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      className: 'text-left text-gray-6 bg-transparent',
    },
    {
      title: 'PR',
      dataIndex: 'pr',
      key: 'pr',
      className: 'text-right bg-transparent text-gray-6',
      render: text => <span className="font-weight-bold">{text}</span>,
    },
    {
      title: 'Specific Yield',
      dataIndex: 'specificYield',
      key: 'specificYield',
      className: 'text-right bg-transparent text-gray-6',
      render: text => <span className="font-weight-bold">{text}</span>,
    },
    {
      title: 'Power',
      dataIndex: 'power',
      key: 'power',
      className: 'text-right bg-transparent text-gray-6',
      render: text => <span className="font-weight-bold">{text}</span>,
    },
  ]

  return (
    <div>
      <div className="height-200 position-relative mb-3 pt-2">
        <VectorMap
          map="world_mill"
          markers={{
            US: { latLng: [38.9, -98.45], name: 'Name of City' },
            IN: { latLng: [31.9, -98.45], name: 'Name of City' }
          }}
          backgroundColor="transparent"
          containerStyle={{
            width: '100%',
            height: '100%',
          }}
          containerClassName="map"
          regionStyle={{
            initial: {
              fill: '#d1e6fa',
              'fill-opacity': 0.9,
              stroke: '#fff',
              'stroke-width': 2,
              'stroke-opacity': 0.05,
            },
            hover: {
              'fill-opacity': 0.8,
              fill: '#1b55e3',
              cursor: 'pointer',
            },
          }}
          series={{
            regions: [
              {
                attribute: 'fill',

              },
            ],
          }}
        />
      </div>
      <div className={style.table}>
        <Table columns={columns} dataSource={dataSource} pagination={false} />
      </div>
    </div>
  )
}

export default Chart7
