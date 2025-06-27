namespace ChartMaker.Domain.Entities;

public class Chart
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }

    public ICollection<ChartData> Data { get; set; } = new List<ChartData>();

    public void AddData(string label, string value)
    {
        Data.Add(new ChartData { Label = label, Value = value });
    }
}