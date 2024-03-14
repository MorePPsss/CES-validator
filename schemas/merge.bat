@echo off
setlocal enabledelayedexpansion

rem 获取当前目录
set "work_dir=%CD%"

rem 设置输出文件路径
set "output_file=%work_dir%\combined.txt"

rem 创建空白输出文件
type nul > "%output_file%"

rem 遍历目录下的所有.json文件
for %%i in ("%work_dir%\*.json") do (
    set "filename=%%~ni"
    set "filename=!filename:.=_!"
    echo !filename!= >> "%output_file%"
    type "%%i" >> "%output_file%"
    echo , >> "%output_file%"
)

rem 输出所有.json文件名到末尾，每个文件名后面加逗号
set "file_list="
for %%i in ("%work_dir%\*.json") do (
    set "filename=%%~ni"
    set "filename=!filename:.=_!"
    set "file_list=!file_list!, !filename!"
)
echo %file_list:~2% >> "%output_file%"

echo "合并完成"
pause