function ParkingMap(){
    var map = new Object();
    map['NORREPORT'] = {lat: 56.16184778799529, lng:10.21258195203404};
    map['SCANDCENTER'] = {lat: 56.15164989546772, lng: 10.19840765815879};
    map['BRUUNS'] = {lat: 56.14987481709147, lng: 10.20609304489349};
    map['NewBusgadehuset'] = {lat: 56.15532574386194, lng: 10.20613738198009};
    map['MAGASIN'] = {lat: 56.15674483398173, lng: 10.20492314504883};
    map['KALKVAERKSVEJ'] = {lat: 56.14957786404207, lng: 10.21122275310017};
    map['SALLING'] = {lat: 56.15390545875265, lng: 10.20764770141504};
    map['Navitas'] = {lat: 56.15986622043042, lng: 10.21680929819052};
    map['Urban Level 1'] = {lat: 56.15402792829961, lng: 10.21370572644181};
    map['Urban Level 2+3'] = {lat: 56.15396301219192, lng: 10.21350598245308};
    return map;
}

module.exports.ParkingMap = ParkingMap;