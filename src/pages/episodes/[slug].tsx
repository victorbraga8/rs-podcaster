import { useRouter} from 'next/router';
import {GetStaticProps, GetStaticPaths} from 'next';
import { api } from '../../services/api';
import {format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { conversor } from '../../utils/conversor';
import styles from './episode.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { usePlayer } from '../../contexts/PlayerContext';
import Head from 'next/head';

type Episodes = {
    id: string;
    title: string;
    nember:string;
    thumbnail: string;
    members: string;
    publishedAt: string;
    duration:number;
    durationAsString: string;
    description: string;
    url: string;
  }

  type episodeProps = {  
    episode:Episodes;    
  } 
 

export default function Episode({episode}:episodeProps){
    const {play} = usePlayer();
    const router = useRouter();
    return (        
        <div className={styles.episode}>
            <Head>
                <title>Tocando: {episode.title}</title>
            </Head>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>
                <Image width={700} height={160} src={episode.thumbnail} objectFit="cover"/>       
                <button type="button" onClick={()=>play(episode)}>
                    <img src="/play.svg" alt="Tocar Episódio" />
                </button>         
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>
            <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}}/>                
        </div>
    )
}



export const getStaticPaths: GetStaticPaths = async ()=>{
    const {data} = await api.get('transactions', {
        params:{
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc'
        }
    })


    const paths = data.map(episode=>{
        return{
            params:{
                slug:episode.id
            }
        }
    })
    
    return{
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx)=>{
    const {slug} = ctx.params;
    const {data} = await api.get(`/transactions/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale:ptBR
        }),      
        duration: Number(data.file.duration),
        durationAsString : conversor(Number(data.file.duration)),
        description: data.description,
        url: data.file.url
    }

    return {
        props:{
            episode,
        },
        revalidate:60*60*24
    }
}