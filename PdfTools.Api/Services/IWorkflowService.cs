using Microsoft.AspNetCore.Http;
using PdfTools.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PdfTools.Api.Services
{
    public interface IWorkflowService
    {
        Task<byte[]> ExecuteWorkflowAsync(WorkflowDefinition workflow, List<IFormFile> files);
    }
}
