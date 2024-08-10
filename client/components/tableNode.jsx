import React, { memo } from 'react';
import ColumnNode from './columnNode';

export default memo(({ data }) => {
  const { tableName, columns, dataTypes } = data;

  // conditional -- array is undefined for the first two logs
  let tableColumns;

  columns
    ? (tableColumns = columns.map((column, index) => (
        <ColumnNode
          columnName={column}
          dataType={dataTypes[index]}
          id={column}
          tableName={tableName}
        />
      )))
    : tableColumns;

  return (
    <>
      <div className='tableHeader'>
        <strong>{tableName}</strong>
      </div>
      <br />
      {tableColumns}
    </>
  );
});
