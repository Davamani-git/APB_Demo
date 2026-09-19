using Microsoft.AspNetCore.Mvc;
using VK004Demo.Models;
using VK004Demo.Services;

namespace VK004Demo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentController : ControllerBase
    {
        private readonly IDocumentService _documentService;

        public DocumentController(IDocumentService documentService)
        {
            _documentService = documentService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Document>>> GetAllDocuments()
        {
            try
            {
                var documents = await _documentService.GetAllDocumentsAsync();
                return Ok(documents);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving documents", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Document>> GetDocument(string id)
        {
            try
            {
                var document = await _documentService.GetDocumentByIdAsync(id);
                if (document == null)
                {
                    return NotFound(new { message = $"Document {id} not found" });
                }
                return Ok(document);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving document", error = ex.Message });
            }
        }

        [HttpGet("application/{applicationId}")]
        public async Task<ActionResult<IEnumerable<Document>>> GetDocumentsByApplication(string applicationId)
        {
            try
            {
                var documents = await _documentService.GetDocumentsByApplicationIdAsync(applicationId);
                return Ok(documents);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving documents", error = ex.Message });
            }
        }

        [HttpGet("expiring")]
        public async Task<ActionResult<IEnumerable<Document>>> GetExpiringDocuments([FromQuery] int thresholdDays = 90)
        {
            try
            {
                var documents = await _documentService.GetExpiringDocumentsAsync(thresholdDays);
                return Ok(documents);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving expiring documents", error = ex.Message });
            }
        }

        [HttpGet("expired")]
        public async Task<ActionResult<IEnumerable<Document>>> GetExpiredDocuments()
        {
            try
            {
                var documents = await _documentService.GetExpiredDocumentsAsync();
                return Ok(documents);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving expired documents", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Document>> CreateDocument([FromBody] Document document)
        {
            try
            {
                if (string.IsNullOrEmpty(document.Id))
                {
                    document.Id = Guid.NewGuid().ToString();
                }

                var created = await _documentService.CreateDocumentAsync(document);
                return CreatedAtAction(nameof(GetDocument), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating document", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Document>> UpdateDocument(string id, [FromBody] Document document)
        {
            try
            {
                document.Id = id;
                var updated = await _documentService.UpdateDocumentAsync(document);
                if (updated == null)
                {
                    return NotFound(new { message = $"Document {id} not found" });
                }
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating document", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDocument(string id)
        {
            try
            {
                var deleted = await _documentService.DeleteDocumentAsync(id);
                if (!deleted)
                {
                    return NotFound(new { message = $"Document {id} not found" });
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting document", error = ex.Message });
            }
        }
    }
}