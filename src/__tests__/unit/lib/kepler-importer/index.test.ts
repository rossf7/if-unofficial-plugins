import {getKeplerConfig, getKeplerInput} from '../../../../lib/kepler-importer';

describe('lib/kepler-importer', () => {
  describe('KeplerPlugin', () => {
    describe('Config validation', () => {
      const validConfig = {
        'prometheus-endpoint': 'https://prometheus-endpoint.com',
        'kepler-observation-window': 300,
        'container-namespace': 'falco',
        'container-name': 'falco',
      };
      it('No error when valid', () => {
        getKeplerConfig(validConfig);
      });

      it('Invalid prometheus endpoint throws error', () => {
        expect(() =>
          getKeplerConfig({
            ...validConfig,
            'prometheus-endpoint': 'prometheus.com',
          })
        ).toThrow();
      });

      it('Observation window of length 0 throws error', () => {
        expect(() =>
          getKeplerConfig({
            ...validConfig,
            'kepler-observation-window': 0,
          })
        ).toThrow();
      });

      it('Observation window of negative length throws error', () => {
        expect(() =>
          getKeplerConfig({
            ...validConfig,
            'kepler-observation-window': -1,
          })
        ).toThrow();
      });

      it('Observation window not an int throws error', () => {
        expect(() =>
          getKeplerConfig({
            ...validConfig,
            'kepler-observation-window': 0.5,
          })
        ).toThrow();
      });

      it('Observation window not an number throws error', () => {
        expect(() =>
          getKeplerConfig({
            ...validConfig,
            'kepler-observation-window': '10',
          })
        ).toThrow();
      });
      it('Invalid container name throws error', () => {
        expect(() =>
          getKeplerConfig({
            ...validConfig,
            'container-name': 'falco{}',
          })
        ).toThrow();
      });

      it('Invalid namespace name throws error', () => {
        expect(() =>
          getKeplerConfig({
            ...validConfig,
            'container-namespace': 'falco{}',
          })
        ).toThrow();
      });

      it('Missing arguments throws error', () => {
        const missing: any = {
          ...validConfig,
        };
        delete missing['container-namespace'];
        expect(() => getKeplerConfig(missing)).toThrow();
      });
    });

    describe('Input validation', () => {
      const validInput = {
        timestamp: '2024-04-01T00:00:00Z',
        duration: 10800,
        'grid/carbon-intensity': 400,
      };
      it('Keep other plugins parameters', () => {
        expect(getKeplerInput(validInput)).toEqual({
          timestamp: new Date('2024-04-01T00:00:00Z'),
          duration: 10800,
          'grid/carbon-intensity': 400,
        });
      });

      it('Zero duration throws error', () => {
        expect(() => getKeplerInput({...validInput, duration: 0})).toThrow();
      });

      it('Negative duration throws error', () => {
        expect(() => getKeplerInput({...validInput, duration: -1})).toThrow();
      });

      it('Float duration throws error', () => {
        expect(() => getKeplerInput({...validInput, duration: 0.5})).toThrow();
      });

      it('String duration throws error', () => {
        expect(() =>
          getKeplerInput({...validInput, duration: '1000'})
        ).toThrow();
      });

      it('Wrong date throws error', () => {
        expect(() =>
          getKeplerInput({...validInput, timestamp: '2024'})
        ).toThrow();
      });
    });
  });
});
