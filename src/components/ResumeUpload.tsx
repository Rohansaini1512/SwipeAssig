import React, { useState } from 'react';
import { Upload, Button, Form, Input, message, Card } from 'antd';
import { InboxOutlined, FileTextOutlined } from '@ant-design/icons';
import { extractResumeData } from '../services/aiService';
import MissingFieldsChat from './MissingFieldsChat';
import { Candidate } from '../types';

interface ResumeUploadProps {
  onCandidateCreated: (candidate: Candidate) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onCandidateCreated }) => {
  const [form] = Form.useForm();
  const [extractedData, setExtractedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showMissingFieldsChat, setShowMissingFieldsChat] = useState(false);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      let extracted;
      
      // Read file content
      const fileContent = await readFileContent(file);
      
      // Use Gemini AI to extract data
      extracted = await extractResumeData(fileContent);
      
      setExtractedData(extracted);
      
      // Check for missing fields
      const missingFields = [];
      if (!extracted.name) missingFields.push('Name');
      if (!extracted.email) missingFields.push('Email');
      if (!extracted.phone) missingFields.push('Phone');
      
      if (missingFields.length > 0) {
        message.warning(`Some information could not be extracted. We'll collect the missing fields: ${missingFields.join(', ')}`);
        setShowMissingFieldsChat(true);
      } else {
        form.setFieldsValue({
          name: extracted.name || '',
          email: extracted.email || '',
          phone: extracted.phone || ''
        });
        message.success('Resume processed successfully! All information extracted.');
      }
    } catch (error) {
      message.error('Error processing resume');
      console.error(error);
    } finally {
      setLoading(false);
    }
    return false; // Prevent default upload
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = reject;
      
      if (file.type === 'application/pdf') {
        // For PDF files, we'll use a simple text extraction
        // In a real implementation, you might want to use a PDF parsing library
        reader.readAsText(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const handleSubmit = (values: any) => {
    // Validate required fields
    if (!values.name || !values.email || !values.phone) {
      message.error('Please fill in all required fields');
      return;
    }

    const candidate: Candidate = {
      id: Date.now().toString(),
      name: values.name,
      email: values.email,
      phone: values.phone,
      resumeText: extractedData?.text,
      interviewStatus: 'not_started',
      currentQuestionIndex: 0,
      questions: [],
      answers: []
    };
    onCandidateCreated(candidate);
    message.success('Candidate profile created successfully!');
  };

  const handleMissingFieldsComplete = (candidate: Candidate) => {
    onCandidateCreated(candidate);
    message.success('Candidate profile created successfully!');
  };

  if (showMissingFieldsChat) {
    return (
      <MissingFieldsChat 
        candidate={extractedData} 
        onComplete={handleMissingFieldsComplete}
      />
    );
  }

  return (
    <Card title="Upload Resume" style={{ marginBottom: 24 }}>
      <Upload.Dragger
        name="resume"
        multiple={false}
        beforeUpload={handleFileUpload}
        accept=".pdf,.docx,.txt"
        showUploadList={false}
        disabled={loading}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag resume file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for PDF, DOCX, and TXT files
        </p>
      </Upload.Dragger>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 24 }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="Enter your email address" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: 'Please enter your phone number' }]}
        >
          <Input placeholder="Enter your phone number" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Profile
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ResumeUpload;
