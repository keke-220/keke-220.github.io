#!/bin/sh

set -eu

if [ "$#" -ne 1 ]; then
    printf 'Usage: %s SOURCE_DIRECTORY\n' "$0" >&2
    exit 2
fi

source_dir=$1
output_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

encode() {
    input=$1
    start=$2
    duration=$3
    speed=$4
    output=$5

    ffmpeg -v error -y \
        -ss "$start" \
        -t "$duration" \
        -i "$source_dir/$input" \
        -an \
        -vf "setpts=(PTS-STARTPTS)/$speed,scale=480:270:force_original_aspect_ratio=increase,crop=480:270,fps=12" \
        -c:v libx264 \
        -preset slow \
        -crf 27 \
        -pix_fmt yuv420p \
        -movflags +faststart \
        "$output_dir/$output"
}

encode_pair() {
    input=$1
    first_start=$2
    first_duration=$3
    second_start=$4
    second_duration=$5
    speed=$6
    output=$7

    ffmpeg -v error -y \
        -ss "$first_start" \
        -t "$first_duration" \
        -i "$source_dir/$input" \
        -ss "$second_start" \
        -t "$second_duration" \
        -i "$source_dir/$input" \
        -an \
        -filter_complex \
        "[0:v]setpts=(PTS-STARTPTS)/$speed,scale=480:270:force_original_aspect_ratio=increase,crop=480:270,fps=12[first];[1:v]setpts=(PTS-STARTPTS)/$speed,scale=480:270:force_original_aspect_ratio=increase,crop=480:270,fps=12[second];[first][second]concat=n=2:v=1:a=0[out]" \
        -map "[out]" \
        -c:v libx264 \
        -preset slow \
        -crf 27 \
        -pix_fmt yuv420p \
        -movflags +faststart \
        "$output_dir/$output"
}

encode_three() {
    first_input=$1
    first_start=$2
    first_duration=$3
    first_speed=$4
    second_input=$5
    second_start=$6
    second_duration=$7
    second_speed=$8
    third_input=$9
    third_start=${10}
    third_duration=${11}
    third_speed=${12}
    output=${13}

    ffmpeg -v error -y \
        -ss "$first_start" \
        -t "$first_duration" \
        -i "$source_dir/$first_input" \
        -ss "$second_start" \
        -t "$second_duration" \
        -i "$source_dir/$second_input" \
        -ss "$third_start" \
        -t "$third_duration" \
        -i "$source_dir/$third_input" \
        -an \
        -filter_complex \
        "[0:v]setpts=(PTS-STARTPTS)/$first_speed,scale=480:270:force_original_aspect_ratio=increase,crop=480:270,fps=12[first];[1:v]setpts=(PTS-STARTPTS)/$second_speed,scale=480:270:force_original_aspect_ratio=increase,crop=480:270,fps=12[second];[2:v]setpts=(PTS-STARTPTS)/$third_speed,scale=480:270:force_original_aspect_ratio=increase,crop=480:270,fps=12[third];[first][second][third]concat=n=3:v=1:a=0[out]" \
        -map "[out]" \
        -c:v libx264 \
        -preset slow \
        -crf 27 \
        -pix_fmt yuv420p \
        -movflags +faststart \
        "$output_dir/$output"
}

encode simify-source.mp4 0 49.75 7 simify.mp4
encode prism-source.mp4 0 40 5.5 prism.mp4
encode vap-tamp-source.mp4 10 41.5 6 vap-tamp.mp4
encode_three expertgen-source.mp4 11 9.6 4.1 \
    expertgen-open-drawer.mp4 9 7.5 3.2 \
    expertgen-push-pear.mp4 0 39 16.5 \
    expertgen.mp4
encode_three golden-banana-pick.mp4 0 10.6 4.6 \
    golden-push-episode-1.mp4 0 11.5 5 \
    golden-pick-cube-episode-1.mp4 0 6.7 3 \
    golden-ticket.mp4
encode_three zerobot-source.mp4 0 27 11.5 \
    zerobot-book.mp4 0 24 10.5 \
    zerobot-ramp.mp4 0 9 4 \
    zerobot.mp4
encode anytask-source.mp4 0 57.5 8 anytask.mp4
encode dkprompt-source.mp4 80 83 11.5 dkprompt.mp4
encode openeqa-source.mp4 0 20 3 openeqa.mp4
encode cowp-source.mp4 75 70 10 cowp.mp4
encode slap-source.mp4 0 146 20 slap.mp4
encode s3o-source.mp4 0 40.34 5.5 s3o.mp4
encode_pair IX0aGdJInWU.mp4 37 32 70 38 10 particleformer.mp4
encode 7GPg8KJnf2E.mp4 0 16.8 2.4 llm-grop.mp4
encode inORKP4F3EI.mp4 100 43 6 robotic-table-wiping.mp4
encode 3T22B6tCYFA.mp4 55 58 8 glad.mp4
encode -E6wd3E1fMQ.mp4 58.5 42 6 meal.mp4
encode 3ijtbbeCQho.mp4 40 21.5 3 tmoc.mp4
encode aGbTxCGJSDM.mp4 2 16 2.4 360-vision-attention.mp4
encode_pair tmpud-source.mp4 5.5 13 21 30 6 task-motion-planning-urban-driving.mp4
