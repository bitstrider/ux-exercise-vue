import { LoadingState } from 'src/config/loading-state';

// Helper to set global loading state
export const setLoading = (isLoading = false) => LoadingState.$emit('toggle', isLoading);

// extract id from resource instance url path
// eg. takes https://swapi.co/api/vehicles/14/ and returns 14
export const extractId = (path) => {
  if(path === undefined) return

  const arr = path.split('/');
  return arr[arr.length-2]; //second to last element contains id
}
