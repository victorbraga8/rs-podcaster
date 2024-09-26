"use client";
import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths } from "next";
import { api } from "../../services/api";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { conversor } from "../../utils/conversor";
import styles from "./episode.module.scss";
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "../../contexts/PlayerContext";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import helpers from "@/src/utils/helpers";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, CircleArrowLeft, Play } from "lucide-react";
const axios = require("axios");

type Episodes = {
  id: string;
  title: string;
  nember: string;
  thumbnail: string;
  members: string;
  published_at: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
};

type episodeProps = {
  episode: Episodes;
};

export default function Episode() {
  const { play, allEpisodes } = usePlayer();
  const [episode, setEpisode] = useState<Episodes>();
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    const filteredEpisode = allEpisodes.find((episode) => episode.id === slug);
    setEpisode(filteredEpisode);
  }, []);

  return (
    <div className="">
      <Head>
        <title>Tocando: {episode?.title || "Episódio"}</title>
      </Head>
      <div className="p-12">
        {episode ? (
          <div>
            <div className="flex justify-center mb-8">
              <Image
                alt=""
                width={700}
                height={160}
                src={episode.thumbnail || "/default-thumbnail.jpg"}
                objectFit="cover"
                className=""
              />
            </div>
            <div className="flex justify-between gap-4 mb-4 px-36">
              <Link href="/">
                <Button className="bg-fuchsia-600 hover:bg-fuchsia-900 h-10 w-10 relative">
                  <ArrowBigLeft size={25} className="absolute inset-0 m-auto" />
                </Button>
              </Link>
              <Button
                className="h-10 w-10 relative bg-lime-600 hover:bg-lime-800"
                onClick={() => play(episode)}
              >
                <Play size={20} className="absolute inset-0 m-auto" />
              </Button>
            </div>
            <hr className="mb-2" />

            <div>
              <h4>{helpers.formatDate(episode.published_at)}</h4>
              <h1 className="text-2xl mb-2">{episode.title}</h1>
              <h3 className="mb-4">{episode.members}</h3>
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{
                  __html: episode.description || "",
                }}
              />
            </div>
          </div>
        ) : (
          <p>Episódio não encontrado.</p>
        )}
      </div>
    </div>
  );
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   const { data } = await api.get("transactions", {
//     params: {
//       _limit: 2,
//       _sort: "published_at",
//       _order: "desc",
//     },
//   });

//   const paths = data.map((episode) => {
//     return {
//       params: {
//         slug: episode.id,
//       },
//     };
//   });

//   return {
//     paths,
//     fallback: "blocking",
//   };
// };

// export const getStaticProps: GetStaticProps = async (ctx) => {
//   const { slug } = ctx.params;
//   const { data } = await api.get(`/transactions/${slug}`);

//   const episode = {
//     id: data.id,
//     title: data.title,
//     thumbnail: data.thumbnail,
//     members: data.members,
//     publishedAt: format(parseISO(data.published_at), "d MMM yy", {
//       locale: ptBR,
//     }),
//     duration: Number(data.file.duration),
//     durationAsString: conversor(Number(data.file.duration)),
//     description: data.description,
//     url: data.file.url,
//   };

//   return {
//     props: {
//       episode,
//     },
//     revalidate: 60 * 60 * 24,
//   };
// };
