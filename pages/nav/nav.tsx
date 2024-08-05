"use client";
import React, { useState, ForwardedRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import "./nav.css";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

type ComponentType = {
  id: number;
  name: string;
  href?: string;
};
const genre: ComponentType[] = [
  {
    id: 28,
    name: "Action",
    href: "/genre/action",
  },
  {
    id: 12,
    name: "Adventure",
    href: "/genre/adventure",
  },
  {
    id: 16,
    name: "Animation",
    href: "/genre/animation",
  },
  {
    id: 35,
    name: "Comedy",
    href: "/genre/comedy",
  },
  {
    id: 80,
    name: "Crime",
    href: "/genre/crime",
  },
  {
    id: 99,
    name: "Documentary",
    href: "/genre/documentary",
  },
  {
    id: 18,
    name: "Drama",
    href: "/genre/drama",
  },
  {
    id: 10751,
    name: "Family",
    href: "/genre/family",
  },
  {
    id: 14,
    name: "Fantasy",
    href: "/genre/fantasy",
  },
  {
    id: 36,
    name: "History",
    href: "/genre/history",
  },
  {
    id: 27,
    name: "Horror",
    href: "/genre/horror",
  },
  {
    id: 10402,
    name: "Music",
    href: "/genre/music",
  },
  {
    id: 9648,
    name: "Mystery",
    href: "/genre/mystery",
  },
  {
    id: 10749,
    name: "Romance",
    href: "/genre/romance",
  },
  {
    id: 878,
    name: "Science Fiction",
    href: "/genre/science-fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
    href: "/genre/tv-movie",
  },
  {
    id: 53,
    name: "Thriller",
    href: "/genre/thriller",
  },
  {
    id: 10752,
    name: "War",
    href: "/genre/war",
  },
  {
    id: 37,
    name: "Western",
    href: "/genre/western",
  },
];

type ListItemProps = {
  className?: string;
  title: string;
  href: string;
  children?: React.ReactNode;  
};



const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ className, title, href = "" }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref as ForwardedRef<HTMLAnchorElement>}
            className={cn(
              "block select-none space-y-0.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            href={href ?? ""}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground"></p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: 'movie' | 'tv';
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
}

export function Topnav() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const router = useRouter();

  const handleSearchItemClick = (id: number, mediaType: string) => {
    fetch('/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, mediaType }),
    })
    .then(response => response.json())
    .then(data => {
      // Handle the response if needed
      window.location.href = `/player?id=${id}&type=${mediaType}`;
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsExpanded(false);
      setSearchResults([]);
    }, 200);
  };

  useEffect(() => {
    const searchMoviesAndTVShows = async () => {
      if (searchQuery.length > 0) {
        const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${searchQuery}`
          );
          const data = await response.json();
          const filteredResults = data.results.filter(
            (result: SearchResult) => result.media_type === 'movie' || result.media_type === 'tv'
          );
          setSearchResults(filteredResults.slice(0, 5));
        } catch (error) {
          console.error('Error fetching search results:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounce = setTimeout(() => {
      searchMoviesAndTVShows();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const svgclick = () => {
    router.push("/")

  }

  return (
    <div>
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo">

            <svg style={{cursor:"pointer"}} onClick={svgclick}width="152" height="19" viewBox="0 0 152 19" fill="none" xmlns="http://www.w3.org/2000/svg">

<path d="M4.056 18V8.4H0.48V5.64H4.056V4.68C4.056 3.544 4.384 2.632 5.04 1.944C5.696 1.24 6.72 0.887999 8.112 0.887999H13.344V3.648H8.976C8.016 3.648 7.536 4.136 7.536 5.112V5.64H12.672V8.4H7.536V18H4.056ZM14.9138 18V0.839999H18.3938V18H14.9138ZM21.0309 18V5.64H24.5109V18H21.0309ZM21.0069 3.6V0.887999H24.5349V3.6H21.0069ZM33.4841 18.12C31.3401 18.12 29.6681 17.592 28.4681 16.536C27.2681 15.464 26.6681 13.896 26.6681 11.832C26.6681 9.752 27.2681 8.184 28.4681 7.128C29.6681 6.056 31.3401 5.52 33.4841 5.52H41.5241V8.28H33.4841C32.4441 8.28 31.6441 8.568 31.0841 9.144C30.5401 9.72 30.2681 10.616 30.2681 11.832C30.2681 13.032 30.5401 13.92 31.0841 14.496C31.6441 15.072 32.4441 15.36 33.4841 15.36H41.7641V18.12H33.4841ZM43.5544 18V0.839999H47.0344V5.64H55.3384C56.7464 5.64 57.8184 5.976 58.5544 6.648C59.3064 7.304 59.6824 8.248 59.6824 9.48C59.6824 11.496 58.7224 12.696 56.8024 13.08L59.7304 18H55.8184L52.9864 13.224H47.0344V18H43.5544ZM55.1704 8.376H47.0344V10.488H55.1704C55.4904 10.488 55.7384 10.392 55.9144 10.2C56.1064 10.008 56.2024 9.744 56.2024 9.408C56.2024 8.72 55.8584 8.376 55.1704 8.376ZM64.6185 18V8.4H61.0425V5.64H64.6185V4.68C64.6185 3.544 64.9465 2.632 65.6025 1.944C66.2585 1.24 67.2825 0.887999 68.6745 0.887999H73.9065V3.648H69.5385C68.5785 3.648 68.0985 4.136 68.0985 5.112V5.64H73.2345V8.4H68.0985V18H64.6185ZM79.4123 18C78.0043 18 76.9723 17.648 76.3163 16.944C75.6763 16.24 75.3563 15.328 75.3563 14.208V5.64H78.8363V13.8C78.8363 14.76 79.3163 15.24 80.2763 15.24H85.2683C86.2283 15.24 86.7083 14.76 86.7083 13.8V5.64H90.1883V14.208C90.1883 15.328 89.8603 16.24 89.2043 16.944C88.5643 17.648 87.5403 18 86.1323 18H79.4123ZM92.2948 18.12V15.36H104.055C104.727 15.36 105.063 14.984 105.063 14.232C105.063 13.496 104.727 13.128 104.055 13.128H96.4468C95.0228 13.128 93.9428 12.808 93.2068 12.168C92.4708 11.512 92.1028 10.576 92.1028 9.36C92.1028 8.128 92.4708 7.184 93.2068 6.528C93.9588 5.856 95.0388 5.52 96.4468 5.52H107.391V8.28H96.6148C95.9268 8.28 95.5828 8.616 95.5828 9.288C95.5828 9.624 95.6788 9.888 95.8708 10.08C96.0628 10.272 96.3108 10.368 96.6148 10.368H104.679C105.927 10.368 106.879 10.696 107.535 11.352C108.207 11.992 108.543 12.928 108.543 14.16C108.543 15.408 108.207 16.384 107.535 17.088C106.863 17.776 105.911 18.12 104.679 18.12H92.2948ZM110.586 18V5.64H114.066V18H110.586ZM110.562 3.6V0.887999H114.09V3.6H110.562ZM123.039 18.12C120.895 18.12 119.223 17.592 118.023 16.536C116.823 15.464 116.223 13.896 116.223 11.832C116.223 9.752 116.823 8.184 118.023 7.128C119.223 6.056 120.895 5.52 123.039 5.52H127.479C129.623 5.52 131.295 6.056 132.495 7.128C133.695 8.184 134.295 9.752 134.295 11.832C134.295 13.896 133.695 15.464 132.495 16.536C131.295 17.592 129.623 18.12 127.479 18.12H123.039ZM123.039 15.36H127.479C128.519 15.36 129.311 15.072 129.855 14.496C130.415 13.92 130.695 13.032 130.695 11.832C130.695 10.616 130.415 9.72 129.855 9.144C129.311 8.568 128.519 8.28 127.479 8.28H123.039C121.999 8.28 121.199 8.568 120.639 9.144C120.095 9.72 119.823 10.616 119.823 11.832C119.823 13.032 120.095 13.92 120.639 14.496C121.199 15.072 121.999 15.36 123.039 15.36ZM136.461 18V5.64H147.237C148.645 5.64 149.669 5.992 150.309 6.696C150.965 7.384 151.293 8.296 151.293 9.432V18H147.813V9.84C147.813 8.88 147.333 8.4 146.373 8.4H139.941V18H136.461Z" fill="white"/>
</svg>
</div>
          <NavigationMenu className="nav-menu">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Genre</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-0 p-4 md:w-[300px] md:grid-cols-2 lg:w-[350px]">
                    {genre.map((genre) => (
                      <ListItem key={genre.id} title={genre.name} href={`/genre/${genre.id}`} />
                    ))}
                   </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/movies" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Movies
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="tvshows" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    TV
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="nav-right">
          <div className="search-container">
            <Input
              className={`search-bar ${isExpanded ? 'expanded' : ''}`}
              placeholder="Search..."
              onClick={() => setIsExpanded(true)}
              onBlur={() => {
                setTimeout(() => setIsExpanded(false), 200);
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isExpanded && searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((result) => (
                  <Link 
                    href={`/player?id=${result.id}&type=${result.media_type}`}
                    key={result.id}
                    onClick={(e) => {
                      e.preventDefault();
                      const requestBody = {
                        id: result.id,
                        media_type: result.media_type,
                      };
                      console.log('Sending request with body:', requestBody);
                      fetch('/api/content', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody),
                      })
                      .then(response => response.json())
                      .then(data => {
                        console.log('Received response:', data);
                        // Handle the response if needed
                        window.location.href = `/player?id=${result.id}&type=${result.media_type}`;
                      })
                      .catch(error => {
                        console.error('Error:', error);
                      });
                    }}
                  >
                    <div className="search-result-item">
                      {result.poster_path && (
                        <img 
                          src={`https://image.tmdb.org/t/p/w92${result.poster_path}`} 
                          alt={result.title || result.name} 
                          className="result-poster"
                        />
                      )}
                      <div className="result-info">
                        <span className="result-title">
                          {result.media_type === 'movie' ? result.title : result.name}
                        </span>
                        <span className="media-type">({result.media_type})</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Button variant="destructive" className="logout-button">logout</Button>
        </div>
      </nav>
    </div>
  );
}