'use client';

import React, { useState } from 'react';
import { Workflow, FileText, Loader2, Plus, Trash2 } from 'lucide-react';

interface WorkflowStep {
  id: string;
  toolId: string;
  parameters: Record<string, unknown>;
}

export default function WorkflowsPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableTools = [
    { id: 'repair', name: 'Onar' },
    { id: 'compress', name: 'Sıkıştır' },
    { id: 'protect', name: 'Koru' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setError(null);
    }
  };

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      toolId: 'repair',
      parameters: {},
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const updateStepTool = (id: string, toolId: string) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, toolId } : step
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0 || steps.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const workflow = {
        name: 'Custom Workflow',
        steps: steps.map((step, index) => ({
          id: (index + 1).toString(),
          toolId: step.toolId,
          parameters: step.parameters,
        })),
      };

      formData.append('workflowJson', JSON.stringify(workflow));

      const response = await fetch('http://localhost:5000/api/Workflows/execute', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Workflow execution failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'workflow_result.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError('Workflow çalıştırılamadı. Lütfen tekrar deneyin.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
          PDF İş Akışları
        </h1>
        <p className="text-lg leading-8 text-slate-600">
          Birden fazla PDF işlemini sırayla otomatik olarak çalıştırın
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload */}
          <div className="flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10 hover:bg-slate-50 transition-colors">
            <div className="text-center">
              {files.length > 0 ? (
                <div className="flex flex-col items-center">
                  <FileText className="mx-auto h-12 w-12 text-teal-300" aria-hidden="true" />
                  <div className="mt-4 text-sm leading-6 text-slate-600">
                    <span className="font-semibold text-teal-600">{files.length} dosya seçildi</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFiles([])}
                    className="mt-2 text-xs font-medium text-red-600 hover:text-red-500"
                  >
                    Temizle
                  </button>
                </div>
              ) : (
                <>
                  <Workflow className="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-teal-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2 hover:text-teal-500"
                    >
                      <span>PDF dosyaları yükle</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".pdf"
                        multiple
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs leading-5 text-slate-600 mt-2">Birden fazla PDF seçebilirsiniz</p>
                </>
              )}
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-900">İş Akışı Adımları</h3>
              <button
                type="button"
                onClick={addStep}
                className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500"
              >
                <Plus className="h-4 w-4" />
                Adım Ekle
              </button>
            </div>

            {steps.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                Henüz adım eklenmedi. &quot;Adım Ekle&quot; butonuna tıklayın.
              </div>
            ) : (
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold">
                      {index + 1}
                    </div>
                    <select
                      value={step.toolId}
                      onChange={(e) => updateStepTool(step.id, e.target.value)}
                      className="flex-1 rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      aria-label="Select tool"
                    >
                      {availableTools.map(tool => (
                        <option key={tool.id} value={tool.id}>{tool.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeStep(step.id)}
                      className="text-red-600 hover:text-red-700"
                      aria-label="Remove step"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={files.length === 0 || steps.length === 0 || isLoading}
            className="flex w-full justify-center items-center gap-2 rounded-md bg-teal-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                İşleniyor...
              </>
            ) : (
              <>
                <Workflow className="h-5 w-5" />
                İş Akışını Çalıştır
              </>
            )}
          </button>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
