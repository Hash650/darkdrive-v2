package com.darkdrive.backend.config;


import com.darkdrive.backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter{
    
    private final JwtUtil jwtUtil;


    public JwtAuthenticationFilter(JwtUtil jwtUtil)
    {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
    throws ServletException, IOException
    {
        String header = request.getHeader("Authorization");

        if(header!= null && header.startsWith("Bearer "))
        {
            String token = header.substring(7);
            String username = jwtUtil.extractUsername(token);

            if(username!= null && SecurityContextHolder.getContext().getAuthentication() == null)
            {
                if(jwtUtil.validateToken(token, username))
                {
                    UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(username, null,null);
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }
        chain.doFilter(request, response);
    }
}
