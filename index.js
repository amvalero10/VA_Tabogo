require([
    "esri/Map",
    "esri/layers/FeatureLayer",
    "esri/views/MapView",
    "esri/widgets/Legend",
    "esri/widgets/Home",
    "esri/widgets/Slider",
    "esri/widgets/Fullscreen",
    "esri/widgets/LayerList",
    "esri/widgets/Expand",

  ], (Map, FeatureLayer, MapView, Legend, Home, Slider, Fullscreen,LayerList,Expand) => {


     //--------------------------------------------------------------------------
    //
    //  Capas Lunes a Domingo
    //
    //--------------------------------------------------------------------------

    const layer_Lunes = new FeatureLayer({
        portalItem: {
          //id: "b41d2298d0a74601b73c35082925d35e"
          id: "5bb00d89ea6a4307bb99f6cea97a2970"
        },
        title: "Lunes",
        minScale: 21211172223.819286,
        effect: "bloom(2.5 0 0.5)"
      });

      const layer_Martes = new FeatureLayer({
        portalItem: {
          id: "18e76e5c5433403eabfed1ecb19f8cfe"
        },
        title: "Martes",
        minScale: 21211172223.819286,
        effect: "bloom(2.5 0 0.5)"
      });

      const layer_Miercoles = new FeatureLayer({
        portalItem: {
          id: "45bc7ad57616494285de95f5a3c4919d"
        },
        title: "Miercoles",
        minScale: 21211172223.819286,
        effect: "bloom(2.5 0 0.5)"
      });

      const layer_Jueves = new FeatureLayer({
        portalItem: {
          id: "9702899b9fe04c03aa8f356c6d7eeaf8"
        },
        title: "Jueves",
        minScale: 21211172223.819286,
        effect: "bloom(2.5 0 0.5)"
      });

      const layer_Viernes = new FeatureLayer({
        portalItem: {
          id: "02914582f8434d3b987f176139986fee"
        },
        title: "Viernes",
        minScale: 21211172223.819286,
        effect: "bloom(2.5 0 0.5)"
      });

      const layer_Sabado = new FeatureLayer({
        portalItem: {
          id: "e4a65cc84c67463483d1cb97427ff5c7"
        },
        title: "Sabado",
        minScale: 21211172223.819286,
        effect: "bloom(2.5 0 0.5)"
      });

      const layer_Domingo = new FeatureLayer({
        portalItem: {
          id: "afca024a08d74fe4847faf1a8cdafc01"
        },
        title: "Domingo",
        minScale: 21211172223.819286,
        effect: "bloom(2.5 0 0.5)",
      });


      //Apagar las capas en la lista del layerList
      layer_Domingo.visible = false;
      layer_Sabado.visible = false;
      layer_Viernes.visible = false;
      layer_Jueves.visible = false;
      layer_Miercoles.visible = false;
      layer_Martes.visible = false;





      const map = new Map({
        basemap: {
          portalItem: {
           id: "4f2e99ba65e34bb8af49733d9778fb8e"
          }
        },
        //layers: [layer_Lunes,layer_Martes]
      });
      map.add(layer_Domingo)
      map.add(layer_Sabado)
      map.add(layer_Viernes)
      map.add(layer_Jueves)
      map.add(layer_Miercoles)
      map.add(layer_Martes)
      map.add(layer_Lunes)
      

      const view = new MapView({
        map: map,
        container: "viewDiv",
        center: [ -74.10975,4.64971], //Bogota
        zoom: 11,
        constraints: {
          //snapToZoom: false,
          minScale: 302223.819286
        },
  
  
        // This ensures that when going fullscreen
        // The top left corner of the view extent
        // stays aligned with the top left corner
        // of the view's container
        resizeAlign: "top-left"
      });




      const layerList = new LayerList({
        view: view
      });
      layerList.visibleElements = {
        statusIndicators: true
      };

      


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
      view.ui.add( new Fullscreen({ view: view, element: applicationDiv }),"top-left"); //boton de pantalla completa
      //view.ui.add( new Expand({ view: view,content: layerList,expanded: false}),"top-right"  ); //boton expandible para los dias
      view.ui.add(layerList, "top-right"); // selector de capas



    // Starts the application
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
        //layer.renderer = createRenderer(value);
        layer_Lunes.renderer = createRenderer(value);
        layer_Martes.renderer = createRenderer(value);
        layer_Miercoles.renderer = createRenderer(value);
        layer_Jueves.renderer = createRenderer(value);
        layer_Viernes.renderer = createRenderer(value);
        layer_Sabado.renderer = createRenderer(value);
        layer_Domingo.renderer = createRenderer(value);
      }


  


   function createRenderer(year){


    const opacityStops = [
        {
          opacity: 1,
          value: year
        },
        {
          opacity: 0,
          //value: year + 0.2
          value: year + 0.5
        }
      ];

    return{
        
        type: "simple",  // autocasts as new SimpleRenderer()
        symbol: {
          type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
          size: 2,
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
                title: "Tweet"
              },
              stops: [
                {
                  value: year,
                  color: "#0ff",
                  //label: "Nuevo " + Math.floor(year)
                  label: "Nuevo"
                }
                ,
                {
                  value: year - 0.6,
                  color: "#f0f",
                  //color: "#404",
                  //label: "" + (Math.floor(year) )
                  label: "Antiguo"
                },
                {
                  value: year - 0.9,
                  //color: "#404",
                  opacity: 1,
                  color: "rgb(31,33,34)",
                  //label: "Antes de  " + (Math.floor(year))
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
      }, 1000 / 50);
    };

    frame();

    return {
      remove: () => {
        animating = false;
      }
    };
  }



  




});