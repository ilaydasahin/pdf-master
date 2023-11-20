using Microsoft.AspNetCore.Http;
using PdfTools.Api.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace PdfTools.Api.Services
{
    public class WorkflowService : IWorkflowService
    {
        private readonly IPdfService _pdfService;
        private readonly IRepairService _repairService;
        
        public WorkflowService(IPdfService pdfService, IRepairService repairService)
        {
            _pdfService = pdfService;
            _repairService = repairService;
        }

        public async Task<byte[]> ExecuteWorkflowAsync(WorkflowDefinition workflow, List<IFormFile> files)
        {
            byte[] currentFile = null;

            // Initial step: Merge all input files if there are multiple
            if (files.Count > 1)
            {
                using var mergedStream = await _pdfService.MergePdfsAsync(files);
                using var ms = new MemoryStream();
                await mergedStream.CopyToAsync(ms);
                currentFile = ms.ToArray();
            }
            else if (files.Count == 1)
            {
                using var ms = new MemoryStream();
                await files[0].CopyToAsync(ms);
                currentFile = ms.ToArray();
            }
            else
            {
                throw new ArgumentException("No files provided");
            }

            foreach (var step in workflow.Steps)
            {
                currentFile = await ExecuteStepAsync(step, currentFile);
            }

            return currentFile;
        }

        private async Task<byte[]> ExecuteStepAsync(WorkflowStep step, byte[] inputFile)
        {
            var formFile = new FormFile(new MemoryStream(inputFile), 0, inputFile.Length, "file", "temp.pdf");

            switch (step.ToolId.ToLower())
            {
                case "repair":
                    return await _repairService.RepairPdfAsync(formFile);
                    
                case "compress":
                    var compressOptions = new CompressOptions();
                    using (var compressedStream = await _pdfService.CompressPdfAsync(formFile, compressOptions))
                    using (var ms = new MemoryStream())
                    {
                        await compressedStream.CopyToAsync(ms);
                        return ms.ToArray();
                    }
                    
                case "protect":
                    var protectOptions = new ProtectOptions 
                    { 
                        UserPassword = step.Parameters.ContainsKey("password") ? step.Parameters["password"].ToString() : "",
                        OwnerPassword = step.Parameters.ContainsKey("password") ? step.Parameters["password"].ToString() : "",
                        AllowPrint = true,
                        AllowCopy = false,
                        AllowModify = false
                    };
                    using (var protectedStream = await _pdfService.ProtectPdfAsync(formFile, protectOptions))
                    using (var ms = new MemoryStream())
                    {
                        await protectedStream.CopyToAsync(ms);
                        return ms.ToArray();
                    }
                    
                default:
                    return inputFile;
            }
        }
    }
}
