import { redirect } from 'react-router';

export async function loader() {
  return redirect('/collections/all');
}

export default function CollectionsIndex() {
  return null;
}
