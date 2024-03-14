@echo off
setlocal enabledelayedexpansion

rem 设置输入文件夹路径和输出文件路径
set "input_folder=schemas"
set "output_file=schemas.js"
set "filename_list=filenames.txt"

rem 清空输出文件和文件名列表
echo. > %output_file%
echo. > %filename_list%

rem 遍历输入文件夹中的所有 JSON 文件，并将它们的内容追加到输出文件
for %%f in (%input_folder%\*.json) do (
    set "filename=%%~nf"
    set "filename=!filename:.=_!"
    echo !filename! = >> %output_file%
    type "%%f" >> %output_file%
    echo , >> %output_file%
    echo !filename! >> %filename_list%
)

rem 将文件名列表追加到输出文件的结尾，并在每个文件名后面加上逗号
echo. >> %output_file%
echo "以下为文件名列表：" >> %output_file%
set "first_line=true"
for /f "usebackq delims=" %%a in ("%filename_list%") do (
    if "!first_line!"=="true" (
        echo %%a, >> %output_file%
        set "first_line=false"
    ) else (
        echo %%a, >> %output_file%
    )
)

echo "合并完成！"