using ChartMaker.Application.Excel.Dto;

namespace ChartMaker.Application.Excel.Interfaces
{
    public interface IExcelDataReader
    {
        List<ExcelDto> Read(Stream excelStream);
    }
}
