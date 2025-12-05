cmake_minimum_required(VERSION 3.26)
project(qubic_contracts LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

find_package(fmt REQUIRED)
find_package(Catch2 3 REQUIRED)

add_library(qubic_ledger STATIC
    src/ledger.cpp
    src/badge_minter.cpp
)

target_include_directories(qubic_ledger PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/src)
target_link_libraries(qubic_ledger PUBLIC fmt::fmt)

enable_testing()
add_executable(qubic_ledger_test tests/ledger_test.cpp)
target_link_libraries(qubic_ledger_test PRIVATE qubic_ledger Catch2::Catch2WithMain)
include(CTest)
include(Catch)
catch_discover_tests(qubic_ledger_test)
