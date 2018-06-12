# Polar Picker

In sailing, a polar diagram, or more commonly just "polars", is a radial plot of speed vs true wind angle, and gives a compact indication of how fast the boat can go for a given wind speed and wind direction. [Ockam Instruments](http://www.ockam.com/2013/06/03/what-are-polars/) has a good overview of what, why, and more details about polars.

Polar Picker is a front end interface for displaying and modifying a polar diagram, built using D3 and React.

## Current Features

- Temporary inital data is based on polar diagrams for a [J-111](https://www.j111class.org/tuning/tuning)
- Diagram scale is generated dynamically based on maximum speed values of data
- Closest point is highlighted and value (speed, true wind angle), and displayed on mousemove
- Clicking on a point opens the edit dialog where point values can be changed. Enter saves the values.

## Technical Info

- Plotting and svg manipulation using [D3.js](https://d3js.org/)
- Everything else handled with React, which raised the interesting challenge of integrating React's abstracted DOM management with D3's direct DOM manipulation in such a way that both libraries could happily co-exist.

## Future Plans and Current Issues

- Display data in table form
- Re-format plot for more efficient use of space at low angles of attack (speed will generally be much higher around 130° than 30° - 60°)
- Align angle labels properly
- Improve UI for point edit field
- Add wind speed lables for each wind speed curve
- Actually style everything
- Add variable precision to path finding algorithm to improve precision at low mouse movement speeds without impacting performance when moving mouse quickly.
- And much much more!
