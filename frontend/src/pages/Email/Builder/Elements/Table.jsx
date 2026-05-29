import React from "react";

export default function TableComponent({ style, outerStyle, tableData }) {
    return (
        <div style={outerStyle}>
            <table style={style}>
                <thead>
                    <tr>
                        <th>Title</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.title}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
