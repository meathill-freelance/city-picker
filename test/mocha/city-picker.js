/**
 * Created by realm on 2017/2/22.
 */
const should = require('should');
const cities = require('../../assets/city.json');
import CityPicker from '../../app/city-picker';

describe('CityPicker', () => {
  describe('#format', () => {
    it('should format correctly', () => {
      let result = CityPicker.format(cities);
      result.should.be.a.Object();
      result.should.has.a.property('hot').which.is.an.Array().which.has.length(CityPicker.hotLength);
      result.should.has.a.property('vocabulary').which.is.an.Array();
      result.should.has.a.property('list').which.is.an.Array();
    });
  })
});