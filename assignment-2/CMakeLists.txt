cmake_minimum_required(VERSION 3.24)
project(assignment_two)

set(CMAKE_CXX_STANDARD 17)

set(PROJECT_HEADERS
        workers.h
        )
set(PROJECT_SOURCES
        main.cpp
        workers.cpp
        )

SET(CMAKE_CXX_FLAGS -pthread)

add_executable(assignment-two ${PROJECT_SOURCES} ${PROJECT_HEADERS})