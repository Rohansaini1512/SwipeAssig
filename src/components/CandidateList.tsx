import React, { useState } from 'react';
import { Table, Button, Input, Tag, Space, Typography, Modal, Card, Progress } from 'antd';
import { SearchOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Candidate } from '../types';

const { Search } = Input;
const { Title, Text } = Typography;

const CandidateList: React.FC = () => {
  const { candidates } = useSelector((state: RootState) => state.interview);
  const [searchText, setSearchText] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in_progress': return 'blue';
      case 'paused': return 'orange';
      default: return 'default';
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'default';
    if (score >= 8) return 'green';
    if (score >= 6) return 'blue';
    if (score >= 4) return 'orange';
    return 'red';
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchText.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (!a.finalScore && !b.finalScore) return 0;
    if (!a.finalScore) return 1;
    if (!b.finalScore) return -1;
    return b.finalScore - a.finalScore;
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Candidate) => (
        <Space>
          <UserOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'interviewStatus',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Score',
      dataIndex: 'finalScore',
      key: 'score',
      render: (score: number) => (
        <Tag color={getScoreColor(score)}>
          {score ? `${score}/10` : 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (record: Candidate) => {
        const progress = record.questions.length > 0 
          ? ((record.currentQuestionIndex + 1) / record.questions.length) * 100 
          : 0;
        return <Progress percent={progress} size="small" />;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Candidate) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedCandidate(record);
            setModalVisible(true);
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={4}>Candidates ({candidates.length})</Title>
          <Search
            placeholder="Search candidates..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
          />
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={sortedCandidates}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      />

      <Modal
        title={`Candidate Details - ${selectedCandidate?.name}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedCandidate && (
          <div>
            <Card style={{ marginBottom: 16 }}>
              <Title level={5}>Profile Information</Title>
              <p><strong>Name:</strong> {selectedCandidate.name}</p>
              <p><strong>Email:</strong> {selectedCandidate.email}</p>
              <p><strong>Phone:</strong> {selectedCandidate.phone}</p>
              <p><strong>Status:</strong> 
                <Tag color={getStatusColor(selectedCandidate.interviewStatus)}>
                  {selectedCandidate.interviewStatus.replace('_', ' ').toUpperCase()}
                </Tag>
              </p>
              {selectedCandidate.finalScore && (
                <p><strong>Final Score:</strong> 
                  <Tag color={getScoreColor(selectedCandidate.finalScore)}>
                    {selectedCandidate.finalScore}/10
                  </Tag>
                </p>
              )}
            </Card>

            {selectedCandidate.summary && (
              <Card style={{ marginBottom: 16 }}>
                <Title level={5}>AI Summary</Title>
                <Text>{selectedCandidate.summary}</Text>
              </Card>
            )}

            {selectedCandidate.questions.length > 0 && (
              <Card>
                <Title level={5}>Interview Questions & Answers</Title>
                {selectedCandidate.questions.map((question, index) => {
                  const answer = selectedCandidate.answers.find(a => a.questionId === question.id);
                  return (
                    <div key={question.id} style={{ marginBottom: 16, padding: 12, border: '1px solid #f0f0f0', borderRadius: 6 }}>
                      <Text strong>Q{index + 1}: {question.text}</Text>
                      <br />
                      <Text type="secondary">Difficulty: {question.difficulty.toUpperCase()} | Time Limit: {question.timeLimit}s</Text>
                      {answer && (
                        <div style={{ marginTop: 8 }}>
                          <Text strong>Answer:</Text>
                          <p>{answer.text}</p>
                          {answer.score && (
                            <Space>
                              <Text>Score: <Tag color={getScoreColor(answer.score)}>{answer.score}/10</Tag></Text>
                              {answer.feedback && <Text type="secondary">Feedback: {answer.feedback}</Text>}
                            </Space>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CandidateList;
