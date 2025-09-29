import React, { useState } from 'react';
import { Upload, Button, Form, Input, message, Card } from 'antd';
import { InboxOutlined, FileTextOutlined } from '@ant-design/icons';
import { extractResumeData } from '../services/aiService';
import MissingFieldsChat from './MissingFieldsChat';
import { Candidate } from '../types';
import { extractFromPDF, extractFromDOCX, ExtractedData } from '../services/resumeParser';

interface ResumeUploadProps {
  onCandidateCreated: (candidate: Candidate) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onCandidateCreated }) => {
  const [form] = Form.useForm();
  const [extractedData, setExtractedData] = useState<Partial<Candidate> | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMissingFieldsChat, setShowMissingFieldsChat] = useState(false);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      let baseExtracted: ExtractedData | null = null;

      // Parse file content depending on type
      if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
        baseExtracted = await extractFromPDF(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || /\.docx$/i.test(file.name)) {
        baseExtracted = await extractFromDOCX(file);
      } else {
        // Fallback: read as text (txt or unknown types)
        const text = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string) || '');
          reader.onerror = reject;
          reader.readAsText(file);
        });
        baseExtracted = { name: undefined, email: undefined, phone: undefined, text };
      }

      // Run AI extraction on the raw text and merge with base extracted fields
      const aiExtracted = await extractResumeData(baseExtracted.text);
      const merged = {
        name: aiExtracted.name || baseExtracted.name,
        email: aiExtracted.email || baseExtracted.email,
        phone: aiExtracted.phone || baseExtracted.phone,
        text: baseExtracted.text
      };

      // Store Candidate-shaped partial for MissingFieldsChat
      const candidatePartial: Partial<Candidate> = {
        name: merged.name,
        email: merged.email,
        phone: merged.phone,
        resumeText: merged.text
      };
      setExtractedData(candidatePartial);

      // Check for missing fields
      const missingFields: string[] = [];
      if (!merged.name) missingFields.push('Name');
      if (!merged.email) missingFields.push('Email');
      if (!merged.phone) missingFields.push('Phone');

      if (missingFields.length > 0) {
        message.warning(`Some information could not be extracted. We'll collect the missing fields: ${missingFields.join(', ')}`);
        setShowMissingFieldsChat(true);
      } else {
        // All fields present: auto-create candidate and proceed
        const candidate: Candidate = {
          id: Date.now().toString(),
          name: merged.name as string,
          email: merged.email as string,
          phone: merged.phone as string,
          resumeText: merged.text,
          interviewStatus: 'not_started',
          currentQuestionIndex: 0,
          questions: [],
          answers: []
        };
        onCandidateCreated(candidate);
        message.success('Resume processed successfully! Profile created.');
      }
    } catch (error) {
      message.error('Error processing resume');
      console.error(error);
    } finally {
      setLoading(false);
    }
    return false; // Prevent default upload
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
      resumeText: extractedData?.resumeText,
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

  if (showMissingFieldsChat && extractedData) {
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
