# svg_to_css

This browser based tool will take your svg files and create embeddable css/scss/less for you.

### How Do I Use it?

1. Fork, Download, Open up little app in your modern browser of choice.
2. Drag-n-Drop your svg icons into the browser window
3. Check your svgs and remove if you need to
4. Select your encoding and language
5. Get the code you need?

### How does it work then?

Well to break it down:

1. **Use html5 drag-n-drop api to get content of the files**
	I used this [html5 rocks guide](http://www.html5rocks.com/en/tutorials/dnd/basics/)

2. **Escape & process svg data into**
	Using the SVG data I give the option to escape it using `encodeURIComponent()` for uri escaped data and `btoa()` for base64 data


### Why does this exist? Y U NO use grumpicon or grunt?

I made the very first version of this while working in an agency in 2013. I was really desperate for an automated svg production method. At that time I didnt even know grunt/node/grumpicon existed.