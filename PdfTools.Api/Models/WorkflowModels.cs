using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace PdfTools.Api.Models
{
    public class WorkflowStep
    {
        public string Id { get; set; }
        public string ToolId { get; set; } // e.g., "merge", "compress", "protect"
        public Dictionary<string, object> Parameters { get; set; }
    }

    public class WorkflowDefinition
    {
        public string Name { get; set; }
        public List<WorkflowStep> Steps { get; set; }
    }

    public class WorkflowExecutionRequest
    {
        public WorkflowDefinition Workflow { get; set; }
        // In a real app, we might reference uploaded files by ID.
        // For simplicity here, we'll assume the files are uploaded with the request
        // and mapped by convention or parameter.
    }
}
