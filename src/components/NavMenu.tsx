import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from './Container';

export function NavMenu() {
  return (
    <div className="py-4 mb-2 bg-gray-200">
      <Container>
        <div className="flex flex-row">
          <div className="flex-1 text-lg font-semibold">Reblase</div>

          <div className="space-x-4">
              <Link to="/season/3">Season 3</Link>
              <Link to="/season/4">Season 4</Link>
              <Link to="/season/5">Season 5</Link>
              <Link to="/season/6">Season 6</Link>
              <Link to="/season/7">Season 7</Link>
              <Link to="/season/8">Season 8</Link>
              <Link to="/events"><strong>Recent events</strong></Link>
          </div>
        </div>
      </Container>
    </div>
  )
}