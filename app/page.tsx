import Magazine from '../components/Magazine';import {articles} from '../lib/db';export const dynamic='force-dynamic';export default function Page(){return <Magazine items={articles()}/>}
