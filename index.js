require([
    "esri/Map",
    "esri/layers/FeatureLayer",
    "esri/views/MapView",
    "esri/widgets/Legend",
    "esri/widgets/Home",
    "esri/widgets/Slider",
    "esri/widgets/Fullscreen"
  ], (Map, FeatureLayer, MapView, Legend, Home, Slider, Fullscreen) => {

    const layer = new FeatureLayer({
        portalItem: {
          //id: "b41d2298d0a74601b73c35082925d35e"
          id:"e5fa1777f85b4473bc8f4c2420d1f342"
        },
        title: "Tweet",
        minScale: 21211172223.819286,
        effect: "bloom(2.5 0 0.5)"
      }
      );

      const map = new Map({
        basemap: {
          portalItem: {
           id: "4f2e99ba65e34bb8af49733d9778fb8e"
          }
        },
        layers: [layer]
      });

      
      const view = new MapView({
        map: map,
        container: "viewDiv",
        center: [ -74.08175,4.60971], //Bogota
        zoom: 11,
        constraints: {
          //snapToZoom: false,
          //minScale: 82223.819286
        },
  
  
        // This ensures that when going fullscreen
        // The top left corner of the view extent
        // stays aligned with the top left corner
        // of the view's container
        resizeAlign: "top-left"
      });






 //--------------------------------------------------------------------------
    //
    //  Setup UI
    //
    //--------------------------------------------------------------------------

    const applicationDiv = document.getElementById("applicationDiv");
    const sliderValue = document.getElementById("sliderValue");
    const playButton = document.getElementById("playButton");
    const titleDiv = document.getElementById("titleDiv");
    let animation = null;


  const slider = new Slider({
      container: "slider",
      min: 0,
      max: 24,
      values: [ 0 ],
      step: 1,
      visibleElements: {
        labels: false,
        rangeLabels: true
      }
    });


// Renders three groups of ticks. The first is a basic set
// of 25 ticks. The second places 4 ticks and adds custom
// CSS classes to modify their styling. The third adds
// a click event handler to the tick labels.
// * etiquetas en la barra del slider
slider.tickConfigs = [{
  mode: "count",
  values: 25
}, {
  mode: "percent",
  values: [12.5, 37.5, 62.5, 87.5],
  labelsVisible: true,
  tickCreatedFunction: function(initialValue, tickElement, labelElement) {
    tickElement.classList.add("mediumTicks");
    labelElement.classList.add("mediumLabels");
  }
}, {
  mode: "count",
  values: 5,
  labelsVisible: true,
  tickCreatedFunction: function(initialValue, tickElement, labelElement) {
    tickElement.classList.add("largeTicks");
    labelElement.classList.add("largeLabels");
    labelElement.onclick = function() {
      const newValue = labelElement["data-value"];
      slider.values = [ newValue ];
    };
  }
}];





        // When user drags the slider:
    //  - stops the animation
    //  - set the visualized year to the slider one.
    function inputHandler(event) {
        stopAnimation();
        setYear(event.value);
      }
      slider.on("thumb-drag", inputHandler);


    // Toggle animation on/off when user
    // clicks on the play button
    playButton.addEventListener("click", () => {
        if (playButton.classList.contains("toggled")) {
          stopAnimation();
        } else {
          startAnimation();
        }
      });

      //botones y etiquetas en esquinas
      view.ui.empty("top-left");
      view.ui.add(titleDiv, "top-left"); // titulo
      view.ui.add( new Home({ view: view}),"top-left"); //boton de home
      view.ui.add( new Legend({view: view}),"bottom-left"); //etiqueta de leyenda
      view.ui.add( new Fullscreen({ view: view, element: applicationDiv }),"top-right"); //boton de pantalla completa


    // When the layerview is available, setup hovering interactivity
    //view.whenLayerView(layer).then(setupHoverTooltip);

    // Starts the application by visualizing year 1984
    setYear(00);


    //--------------------------------------------------------------------------
    //
    //  Methods
    //
    //--------------------------------------------------------------------------
   
    /**
     * Sets the current visualized construction year.
     */
    function setYear(value) {
        sliderValue.innerHTML = Math.floor(value);
        slider.viewModel.setValue(0, value);
        layer.renderer = createRenderer(value);
      }


    




  /**
     * Returns a renderer with a color visual variable driven by the input
     * year. The selected year will always render buildings built in that year
     * with a light blue color. Buildings built 20+ years before the indicated
     * year are visualized with a pink color. Buildings built within that
     * 20-year time frame are assigned a color interpolated between blue and pink.
     */
 



    // type: "simple",
        // symbol: {
        //   type: "simple-fill",
        //   color: "rgb(0, 0, 0)",
        //   outline: null
        // }

   function createRenderer(year){


    const opacityStops = [
        {
          opacity: 1,
          value: year
        },
        {
          opacity: 0,
          value: year + 1
        }
      ];

    return{
        
        type: "simple",  // autocasts as new SimpleRenderer()
        symbol: {
          type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
          size: 9,
          color: "rgb(0, 0, 0)",
          outline: null

        //   outline: {  // autocasts as new SimpleLineSymbol()
        //     width: 0.5,
        //     color: "white"
        //   }

        },

        visualVariables: [
            {
              type: "opacity",
              field: "TIME",
              stops: opacityStops,
              legendOptions: {
                showLegend: false
              }
            },
            {
              type: "color",
              field: "TIME",
              legendOptions: {
                title: ""
              },
              stops: [
                {
                  value: year,
                  color: "#0ff",
                  label: "Nuevo " + Math.floor(year)
                },
                {
                  value: year - 1,
                  color: "#f0f",
                  label: "" + (Math.floor(year) - 1)
                },
                {
                  value: year - 5,
                  color: "#404",
                  label: "Antes de  " + (Math.floor(year) - 5)
                }
              ]
            }
          ]


      



    }



   }














    /**
     * Starts the animation that cycle
     * through the construction years.
     */
     function startAnimation() {
        stopAnimation();
        animation = animate(slider.values[0]);
        playButton.classList.add("toggled");
      }

     /**
     * Stops the animations
     */
   function stopAnimation() {
    if (!animation) {
      return;
    }
    animation.remove();
    animation = null;
    playButton.classList.remove("toggled");
  }





/**
     * Animates the color visual variable continously
     */
 function animate(startValue) {
    let animating = true;
    let value = startValue;

    const frame = (timestamp) => {
      if (!animating) {
        return;
      }

      value += 0.01;
      if (value > 23) {
        value = 00;
      }

      setYear(value);

      // Update at 30fps
      setTimeout(() => {
        requestAnimationFrame(frame);
      }, 1000 / 600);
    };

    frame();

    return {
      remove: () => {
        animating = false;
      }
    };
  }



  




});