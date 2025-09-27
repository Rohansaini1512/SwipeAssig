import React from 'react';
import { Card, Typography, Space } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import CandidateList from './CandidateList';

const { Title } = Typography;

const InterviewerTab: React.FC = () => {
  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <DashboardOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          <Title level={3} style={{ margin: 0 }}>Interviewer Dashboard</Title>
        </Space>
      </Card>

      <CandidateList />
    </div>
  );
};

export default InterviewerTab;
