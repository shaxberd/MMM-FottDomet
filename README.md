# MMM-FottDomet
Magic Mirror Module that displays the garbage collection for Cologne, DE

## Configuration

```
{
  module: "MMM-FottDomet",
  position: "top_left",
  config: {
    interval: 120000,
    daysAhead: 14,
    streetCode: 1162,
    streetNo: 45,
    groupDates: true,
    showIcons: true
  }
}
```

## Street Code

To find out your streetCode parameter, go visit the AWB garbage calendar for your address and once opened, look for the value in the URL:
```
[...] "%2C"street_code"%3A"1162"%2C"district [...]
```
