import React from 'react';
// import { Card, Row, Col } from 'react-bootstrap';
// import { RollbackOutlined } from '@ant-design/icons';
import './index.css'
import { AiTwotoneSafetyCertificate } from "react-icons/ai";
import { TbSum } from "react-icons/tb";
import { SiTicktick } from "react-icons/si";
import { GrUpdate } from "react-icons/gr";
import { ImCross } from "react-icons/im";
import { FaSearch } from "react-icons/fa";
 
const widget = () => {
  return (
    <div className="dashboard">
      <div className="row">
        <div className="card orange">
          <div className="card icon">
            <TbSum />
          </div>
          <div style={{ paddingLeft: "100px" }}>
            <div className="label">Total No of Project</div>
            <div className="value">49,650</div>
          </div>
        </div>
        <div className="card orange">
          <div className="card icon">
            <FaSearch />
          </div>
          <div style={{ paddingLeft: "100px" }}>
            <div className="label">Total Inspection Call</div>
            <div className="value">49,650</div>
          </div>
        </div>
        <div className="card orange">
          <div className="card icon">
            <SiTicktick />
          </div>
          <div style={{ paddingLeft: "100px" }}>
            <div className="label">Inspection Ok</div>
            <div className="value">49,650</div>
          </div>
        </div>
        <div className="card orange">
          <div className="card icon">
            <AiTwotoneSafetyCertificate />
          </div>
          <div style={{ paddingLeft: "100px" }}>
            <div className="label">CA</div>
            <div className="value">49,650</div>
          </div>
        </div>
        <div className="card orange">
          <div className="card icon">
            <ImCross />
          </div>
          <div style={{ paddingLeft: "100px" }}>
            <div className="label">Reject</div>
            <div className="value">49,650</div>
          </div>
        </div>
        <div className="card orange">
          <div className="card icon">
            <GrUpdate />
          </div>
          <div style={{ paddingLeft: "100px" }}>
            <div className="label">Rework</div>
            <div className="value">49,650</div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default widget;