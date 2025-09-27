import React, { useState, useEffect } from 'react';
import { Card, Input, Button, message, Typography, Space } from 'antd';
import { SendOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Candidate } from '../types';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface MissingFieldsChatProps {
  candidate: Partial<Candidate>;
  onComplete: (candidate: Candidate) => void;
}

const MissingFieldsChat: React.FC<MissingFieldsChatProps> = ({ candidate, onComplete }) => {
  const [currentField, setCurrentField] = useState<string>('');
  const [collectedData, setCollectedData] = useState<Partial<Candidate>>(candidate);
  const [isComplete, setIsComplete] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    // Determine which field to ask for first
    if (!collectedData.name) {
      setCurrentField('name');
    } else if (!collectedData.email) {
      setCurrentField('email');
    } else if (!collectedData.phone) {
      setCurrentField('phone');
    } else {
      setIsComplete(true);
    }
  }, [collectedData]);

  // Clear input when field changes
  useEffect(() => {
    setInputValue('');
  }, [currentField]);

  const handleSubmit = (value: string) => {
    if (!value.trim()) {
      message.warning('Please provide a valid response');
      return;
    }

    const updatedData = { ...collectedData, [currentField]: value.trim() };
    setCollectedData(updatedData);

    // Check if we need to ask for another field
    if (!updatedData.name) {
      setCurrentField('name');
    } else if (!updatedData.email) {
      setCurrentField('email');
    } else if (!updatedData.phone) {
      setCurrentField('phone');
    } else {
      setIsComplete(true);
    }
  };

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'name':
        return <UserOutlined />;
      case 'email':
        return <MailOutlined />;
      case 'phone':
        return <PhoneOutlined />;
      default:
        return <UserOutlined />;
    }
  };

  const getFieldLabel = (field: string) => {
    switch (field) {
      case 'name':
        return 'Full Name';
      case 'email':
        return 'Email Address';
      case 'phone':
        return 'Phone Number';
      default:
        return field;
    }
  };

  const getFieldPlaceholder = (field: string) => {
    switch (field) {
      case 'name':
        return 'Enter your full name';
      case 'email':
        return 'Enter your email address';
      case 'phone':
        return 'Enter your phone number';
      default:
        return `Enter your ${field}`;
    }
  };

  const handleComplete = () => {
    if (collectedData.name && collectedData.email && collectedData.phone) {
      const completeCandidate: Candidate = {
        id: Date.now().toString(),
        name: collectedData.name,
        email: collectedData.email,
        phone: collectedData.phone,
        resumeText: collectedData.resumeText,
        interviewStatus: 'not_started',
        currentQuestionIndex: 0,
        questions: [],
        answers: []
      };
      onComplete(completeCandidate);
    }
  };

  const handleInputSubmit = () => {
    handleSubmit(inputValue);
    setInputValue('');
  };

  if (isComplete) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Title level={4}>Profile Information Complete!</Title>
          <Space direction="vertical" size="large">
            <div>
              <Text strong>Name:</Text> {collectedData.name}
            </div>
            <div>
              <Text strong>Email:</Text> {collectedData.email}
            </div>
            <div>
              <Text strong>Phone:</Text> {collectedData.phone}
            </div>
            <Button type="primary" size="large" onClick={handleComplete}>
              Continue to Interview
            </Button>
          </Space>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Title level={4}>Let's Complete Your Profile</Title>
        <Text type="secondary">
          We need a few more details before starting your interview.
        </Text>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text strong>
          {getFieldIcon(currentField)} What is your {getFieldLabel(currentField).toLowerCase()}?
        </Text>
      </div>

      <Space.Compact style={{ width: '100%' }}>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={getFieldPlaceholder(currentField)}
          onPressEnter={handleInputSubmit}
          style={{ flex: 1 }}
        />
        <Button 
          type="primary" 
          icon={<SendOutlined />}
          onClick={handleInputSubmit}
        >
          Submit
        </Button>
      </Space.Compact>

      <div style={{ marginTop: 16, fontSize: '12px', color: '#666' }}>
        <Text type="secondary">
          Progress: {Object.keys(collectedData).filter(key => collectedData[key as keyof typeof collectedData]).length}/3 fields completed
        </Text>
      </div>
    </Card>
  );
};

export default MissingFieldsChat;
