import { animate, stagger, createSpring } from 'animejs';

export const fadeInUp = (targets: string | HTMLElement | NodeList, delay = 0) => {
  return animate(targets, {
    translateY: [40, 0],
    opacity: [0, 1],
    duration: 1200,
    delay: stagger(100, { start: delay }),
    ease: 'out(3)',
  });
};

export const fadeIn = (targets: string | HTMLElement | NodeList, delay = 0) => {
  return animate(targets, {
    opacity: [0, 1],
    duration: 1000,
    delay,
    ease: 'out(2)',
  });
};

export const scaleIn = (targets: string | HTMLElement | NodeList, delay = 0) => {
  return animate(targets, {
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: 800,
    delay,
    ease: createSpring({ mass: 1, stiffness: 80, damping: 10 }),
  });
};

export const slideInLeft = (targets: string | HTMLElement | NodeList, delay = 0) => {
  return animate(targets, {
    translateX: [-100, 0],
    opacity: [0, 1],
    duration: 1000,
    delay,
    ease: 'out(3)',
  });
};

export const slideInRight = (targets: string | HTMLElement | NodeList, delay = 0) => {
  return animate(targets, {
    translateX: [100, 0],
    opacity: [0, 1],
    duration: 1000,
    delay,
    ease: 'out(3)',
  });
};

export const staggerFadeIn = (targets: string | HTMLElement | NodeList) => {
  return animate(targets, {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800,
    delay: stagger(150),
    ease: 'out(2)',
  });
};

export const buttonHover = (target: HTMLElement) => {
  animate(target, {
    scale: 1.05,
    duration: 300,
    ease: 'out(2)',
  });
};

export const buttonLeave = (target: HTMLElement) => {
  animate(target, {
    scale: 1,
    duration: 300,
    ease: 'out(2)',
  });
};

export const shimmer = (targets: string | HTMLElement | NodeList) => {
  return animate(targets, {
    translateX: ['-100%', '100%'],
    duration: 2000,
    ease: 'inOut(2)',
    loop: true,
  });
};
