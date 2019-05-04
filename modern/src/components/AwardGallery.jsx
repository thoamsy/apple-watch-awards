// polyfill
import 'intersection-observer';
import React, { useEffect, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import styled from 'styled-components';
import Award from './Award';

const GalleryTitle = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;

  h2 {
    width: 100%:
  }
`;

let ticking = false;

const AwardGallery = ({ title, awards }) => {
  const [intersectingList, setIntersection] = useState(
    Array(awards.length).fill(false),
  );

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      unstable_batchedUpdates(() => {
        entries.forEach(entity => {
          if (entity.isIntersecting) {
            const index = +entity.target.dataset.index;
            setIntersection(list => {
              if (list[index]) {
                observer.unobserve(entity.target);
                return list;
              } else {
                return list.map((status, i) => (i === index ? true : status));
              }
            });
          }
        });
      });
    });
    (document.querySelectorAll('.medal') || []).forEach(item =>
      observer.observe(item),
    );
  }, []);

  useEffect(() => {
    let timer;
    let isScrolling = false;
    const container = document.querySelector('#main');

    const onScroll = () => {
      clearTimeout(timer);
      if (!ticking) {
        !isScrolling && container.classList.add('cant-touch');
        ticking = true;
        isScrolling = true;
        timer = setTimeout(() => {
          container.classList.remove('cant-touch');
          isScrolling = false;
        }, 200);
        requestAnimationFrame(() => {
          ticking = false;
        });
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  console.count(23);
  return (
    <section id="main">
      <div className="inner">
        <GalleryTitle>
          <h2 className="button primary fit small">{title}</h2>
        </GalleryTitle>
        <section className="tiles">
          {awards.map((award, index) => (
            <Award
              index={index}
              key={index}
              isInViewport={intersectingList[index]}
              {...award}
            />
          ))}
        </section>
      </div>
    </section>
  );
};

export default AwardGallery;
