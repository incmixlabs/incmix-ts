const importComponent = `import { GoogleMaps } from "@incmix/ui"`;

const basicUsage = `<GoogleMap.Wrapper apiKey="">
<GoogleMap
  googleMapsProps={{ center: { lat: 53.551086, lng: 9.993682 } }}
>
  <GoogleMap.Marker position={{ lat: 53.551086, lng: 9.993682 }} />
  <GoogleMap.Marker position={{ lat: 52.520008, lng: 13.404954 }} />
</GoogleMap>
</GoogleMap.Wrapper>`;

export const snippets = {
  importComponent,
  basicUsage,
};
