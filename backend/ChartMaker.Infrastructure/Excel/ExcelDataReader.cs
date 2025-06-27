using ChartMaker.Application.Excel.Dto;
using ChartMaker.Application.Excel.Interfaces;
using ClosedXML.Excel;

public class ExcelDataReader : IExcelDataReader
{
    public List<ExcelDto> Read(Stream excelStream)
    {
        var result = new List<ExcelDto>();

        using var workbook = new XLWorkbook(excelStream);
        var worksheet = workbook.Worksheets.First();

        var cells = worksheet.CellsUsed();

        foreach (var cell in cells)
        {
            var dto = new ExcelDto
            {
                Position = cell.Address.ToString(), 
                Value = cell.GetValue<string>() 
            };

            result.Add(dto);
        }

        return result;
    }
}
