using Microsoft.AspNetCore.Mvc;
using PdfTools.Api.Models;
using PdfTools.Api.Services;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace PdfTools.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkflowsController : ControllerBase
    {
        private readonly IWorkflowService _workflowService;

        public WorkflowsController(IWorkflowService workflowService)
        {
            _workflowService = workflowService;
        }

        [HttpPost("execute")]
        public async Task<IActionResult> ExecuteWorkflow([FromForm] List<IFormFile> files, [FromForm] string workflowJson)
        {
            if (files == null || files.Count == 0)
                return BadRequest("No files uploaded.");

            if (string.IsNullOrWhiteSpace(workflowJson))
                return BadRequest("No workflow definition provided.");

            try
            {
                var workflow = JsonSerializer.Deserialize<WorkflowDefinition>(workflowJson, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (workflow == null)
                    return BadRequest("Invalid workflow definition.");

                var resultBytes = await _workflowService.ExecuteWorkflowAsync(workflow, files);
                return File(resultBytes, "application/pdf", "workflow_result.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
