Module.register("MMM-FottDomet", {
  defaults: {
    interval: 3600000,
    daysAhead: 14,
    streetCode: 745,
    streetName: "Domkloster",
    streetNo: "4",
    groupDates: false,
    showIcons: false
  },
  start: function () {
    this.cleanList = [];
  },
  getHeader: function() {
    return "FottDomet";
  },
  getStyles: function() {
    return ['goldammer.css'];
  },
  getDom: function() {
    var element = document.createElement("div");
    element.className = "myContent";
    element.innerHTML = '';
    var tableElement = document.createElement("table");
    tableElement.className = "small";
//    subElement.innerHTML = '<i class="fas fa-trash"</i>';
    for (var i = 0; i < this.cleanList.length; i++) {
      var trElement = document.createElement("tr");
      var tdTypeElement = document.createElement("td");
      tdTypeElement.className = "type bright";
      var tdDateElement = document.createElement("td");
      tdDateElement.className = "date light";
      tdDateElement.innerHTML = ("0" + this.cleanList[i].date.getDate()).slice(-2) + "." + ("0" + (this.cleanList[i].date.getMonth() + 1)).slice(-2) + ".";
      for (var j = 0; j < this.cleanList[i].type.length; j++) {
        if (this.config.groupDates) {
          tdTypeElement.innerHTML += "/" + this.cleanList[i].type[j];
        } else {
          trElement = document.createElement("tr");
          tdTypeElement = document.createElement("td");
          tdTypeElement.innerHTML = this.cleanList[i].type[j];
          tdTypeElement.className = "type bright";
          trElement.appendChild(tdTypeElement);
          tdDateElement = document.createElement("td");
          tdDateElement.innerHTML = ("0" + this.cleanList[i].date.getDate()).slice(-2) + "." + ("0" + (this.cleanList[i].date.getMonth() + 1)).slice(-2) + ".";
          tdDateElement.className = "date light";
          trElement.appendChild(tdDateElement);
          tableElement.appendChild(trElement);
        }
      };
      if (this.config.groupDates) {
        tdTypeElement.innerHTML = tdTypeElement.innerHTML.substr(1);
        trElement.appendChild(tdTypeElement);
        trElement.appendChild(tdDateElement);
        tableElement.appendChild(trElement);
      }
    };
    element.appendChild(tableElement);

    return element;
  },
  notificationReceived: function(notification, payload, sender) {
    switch(notification) {
      case "DOM_OBJECTS_CREATED":
        var timer = setInterval(()=>{
          this.getData();
        }, this.config.interval)
        this.getData();
        break;
    }
  },
  socketNotificationReceived: function(notification, payload) {
    console.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);

    payload.data.sort(function(a, b){
      return new Date(a.year, a.month - 1, a.day) - new Date(b.year, b.month - 1, b.day);
    });

    this.cleanList = [];
    var dateNow = new Date(Date.now());
    var dateLimit = new Date(Date.now());
    dateLimit.setDate(dateLimit.getDate() + this.config.daysAhead);
    for (var i = 0; i < payload.data.length; i++) {
      var dataDate = new Date(payload.data[i].year, payload.data[i].month - 1, payload.data[i].day);
      if (dataDate < dateLimit && dataDate > dateNow) {
        if (this.cleanList.find(entry => entry.date.getTime() == dataDate.getTime())) {
          this.cleanList.find(entry => entry.date.getTime() == dataDate.getTime()).type.push(this.translateBin(payload.data[i].type));
        } else {
          this.cleanList.push({date: dataDate, type: [this.translateBin(payload.data[i].type)]});
        }
      }
    }

    this.updateDom();
  },
  getData: function() {
    this.sendSocketNotification('GET_DATA', this.config);
  },
  translateBin: function(apitype) {
    switch (apitype) {
      case "blue":
        if (this.config.showIcons) {
          return '<i class="fas fa-trash" style="color: #81D4FA"></i>';
        } else {
          return "Blau";
        }
        break;
      case "grey":
        if (this.config.showIcons) {
          return '<i class="fas fa-trash" style="color: #B0BEC5"></i>';
        } else {
          return "Grau";
        }
        break;
      case "wertstoff":
        if (this.config.showIcons) {
          return '<i class="fas fa-trash" style="color: #FFE082"></i>';
        } else {
          return "Gelb";
        }
        break;
      case "brown":
        if (this.config.showIcons) {
          return '<i class="fas fa-trash" style="color: #A1887F"></i>';
        } else {
          return "Bio";
        }
        break;
    }
  }
})
