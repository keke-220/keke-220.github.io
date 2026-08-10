# Publication Preview Sources

Last verified: 2026-08-10

These files are silent, looping publication thumbnails. The source videos are not
stored in the repository. Download them into one temporary directory using the
local filenames below, then regenerate every preview with:

```sh
images/publication-previews/regenerate.sh /path/to/source-videos
```

Continuous selections use this exact FFmpeg command:

```sh
ffmpeg -v error -y \
  -ss "$start" \
  -t "$duration" \
  -i "$SOURCE_DIR/$input" \
  -an \
  -vf "setpts=(PTS-STARTPTS)/$speed,scale=480:270:force_original_aspect_ratio=increase,crop=480:270,fps=12" \
  -c:v libx264 \
  -preset slow \
  -crf 27 \
  -pix_fmt yuv420p \
  -movflags +faststart \
  "images/publication-previews/$output"
```

Two-part selections use this exact FFmpeg command to omit an interstitial while
preserving the setup and completed result:

```sh
ffmpeg -v error -y \
  -ss "$first_start" \
  -t "$first_duration" \
  -i "$SOURCE_DIR/$input" \
  -ss "$second_start" \
  -t "$second_duration" \
  -i "$SOURCE_DIR/$input" \
  -an \
  -filter_complex \
  "[0:v]setpts=(PTS-STARTPTS)/$speed,scale=480:270:force_original_aspect_ratio=increase,crop=480:270,fps=12[first];[1:v]setpts=(PTS-STARTPTS)/$speed,scale=480:270:force_original_aspect_ratio=increase,crop=480:270,fps=12[second];[first][second]concat=n=2:v=1:a=0[out]" \
  -map "[out]" \
  -c:v libx264 \
  -preset slow \
  -crf 27 \
  -pix_fmt yuv420p \
  -movflags +faststart \
  "images/publication-previews/$output"
```

Three-task montages use independent source windows and speed factors so each
segment can retain a complete action:

```sh
ffmpeg -v error -y \
  -ss "$first_start" \
  -t "$first_duration" \
  -i "$SOURCE_DIR/$first_input" \
  -ss "$second_start" \
  -t "$second_duration" \
  -i "$SOURCE_DIR/$second_input" \
  -ss "$third_start" \
  -t "$third_duration" \
  -i "$SOURCE_DIR/$third_input" \
  -an \
  -filter_complex \
  "[0:v]setpts=(PTS-STARTPTS)/$first_speed,scale=480:270:force_original_aspect_ratio=increase,crop=480:270,fps=12[first];[1:v]setpts=(PTS-STARTPTS)/$second_speed,scale=480:270:force_original_aspect_ratio=increase,crop=480:270,fps=12[second];[2:v]setpts=(PTS-STARTPTS)/$third_speed,scale=480:270:force_original_aspect_ratio=increase,crop=480:270,fps=12[third];[first][second][third]concat=n=3:v=1:a=0[out]" \
  -map "[out]" \
  -c:v libx264 \
  -preset slow \
  -crf 27 \
  -pix_fmt yuv420p \
  -movflags +faststart \
  "images/publication-previews/$output"
```

Every speed factor is greater than `1`, so the previews compress longer source
sequences rather than slowing short clips to fill 6-8 seconds. The selected
windows retain setup, execution, and a visible outcome where the official video
provides them.

| Publication | Source page | Source asset and local filename | Selected source range | Output | Exact encoder invocation |
| --- | --- | --- | --- | --- | --- |
| Test-Time Spatial Reasoning / Simify | Author-provided paper at `pdfs/simify.pdf` | Author-provided `simify_stack_3objects_cut.mp4`, copied into the source directory as `simify-source.mp4` | 0.0-49.75 s at 7x; complete three-object stacking task through the stable final tower | `simify.mp4` | `encode simify-source.mp4 0 49.75 7 simify.mp4` |
| Scaling Short-Term Memory / PRISM | `https://shahrutav.github.io/short-term-memory/` | `https://shahrutav.github.io/short-term-memory/static/rw_videos/rw1.mp4` as `prism-source.mp4` | 0.0-40.0 s at 5.5x; complete transfer from the bin to the tray | `prism.mp4` | `encode prism-source.mp4 0 40 5.5 prism.mp4` |
| VAP-TAMP | `https://vap-tamp.github.io/vap-tamp/` | `https://vap-tamp.github.io/vap-tamp/videos/IROS26_3741_VI_i.mp4` as `vap-tamp-source.mp4` | 10.0-51.5 s at 6x; failed precondition, active perception, replanning, pickup success | `vap-tamp.mp4` | `encode vap-tamp-source.mp4 10 41.5 6 vap-tamp.mp4` |
| ExpertGen | `https://pages.rai-inst.com/expertgen/` | BananaLift: `https://pages.rai-inst.com/expertgen/static/videos_compressed/ExpertGen-BananaLift.mp4` as `expertgen-source.mp4`<br>OpenDrawer: `https://pages.rai-inst.com/expertgen/static/videos_compressed/ExpertGen-OpenDrawer.mp4` as `expertgen-open-drawer.mp4`<br>PushPear: `https://pages.rai-inst.com/expertgen/static/videos_compressed/ExpertGen-PushPear.mp4` as `expertgen-push-pear.mp4` | BananaLift 11.0-20.6 s at 4.1x; OpenDrawer 9.0-16.5 s at 3.2x; PushPear 0.0-39.0 s at 16.5x. Each segment includes setup, execution, and the completed result. | `expertgen.mp4` | `encode_three expertgen-source.mp4 11 9.6 4.1 expertgen-open-drawer.mp4 9 7.5 3.2 expertgen-push-pear.mp4 0 39 16.5 expertgen.mp4` |
| Golden Ticket | `https://lottery-tickets.rai-inst.com/` | Banana pick: `https://lottery-tickets.rai-inst.com/media/pick/eagle_noise.mp4` as `golden-banana-pick.mp4`<br>Cup push: `https://lottery-tickets.rai-inst.com/media/push/gt_eval/fixed_camera_data_episode_1.mp4` as `golden-push-episode-1.mp4`<br>Cube pick: `https://lottery-tickets.rai-inst.com/media/pick_cube/gt_good/corrected_camera_data_episode_1.mp4` as `golden-pick-cube-episode-1.mp4` | Banana pick 0.0-10.6 s at 4.6x; cup push 0.0-11.5 s at 5x; cube pick 0.0-6.7 s at 3x. All three are successful Golden Ticket evaluations with the final object state visible. | `golden-ticket.mp4` | `encode_three golden-banana-pick.mp4 0 10.6 4.6 golden-push-episode-1.mp4 0 11.5 5 golden-pick-cube-episode-1.mp4 0 6.7 3 golden-ticket.mp4` |
| ZeroBot | `https://zerobot-rl.github.io/` | Bottle pickup: `https://zerobot-rl.github.io/assets/videos/novelposes.mp4` as `zerobot-source.mp4`<br>Book nudge-and-grasp: `https://zerobot-rl.github.io/assets/videos/book.mp4` as `zerobot-book.mp4`<br>Can push-up-ramp: `https://zerobot-rl.github.io/assets/videos/ramp.mp4` as `zerobot-ramp.mp4` | NovelPoses 0.0-27.0 s at 11.5x; MultiStageBook 0.0-24.0 s at 10.5x; PushUpRamp 0.0-9.0 s at 4x. Each source is used in full so the nudge, grasp, and push outcomes are not cut short. | `zerobot.mp4` | `encode_three zerobot-source.mp4 0 27 11.5 zerobot-book.mp4 0 24 10.5 zerobot-ramp.mp4 0 9 4 zerobot.mp4` |
| AnyTask | `https://anytask.rai-inst.com/` | `https://anytask.rai-inst.com/assets/videos/side_by_side/real_put_strawberry_into_closed_drawer_small.mp4` as `anytask-source.mp4` | 0.0-57.5 s at 8x; open drawer, place object, and close drawer | `anytask.mp4` | `encode anytask-source.mp4 0 57.5 8 anytask.mp4` |
| ParticleFormer | `https://suninghuang19.github.io/particleformer_page/` | `https://www.youtube.com/watch?v=IX0aGdJInWU` as `IX0aGdJInWU.mp4` | 37.0-69.0 s and 70.0-108.0 s at 10x; completed box-pushing plus cloth/rope manipulation | `particleformer.mp4` | `encode_pair IX0aGdJInWU.mp4 37 32 70 38 10 particleformer.mp4` |
| LLM-GROP | `https://sites.google.com/view/llm-grop` | `https://www.youtube.com/watch?v=7GPg8KJnf2E` as `7GPg8KJnf2E.mp4` | 0.0-16.8 s at 2.4x; entire available planning result | `llm-grop.mp4` | `encode 7GPg8KJnf2E.mp4 0 16.8 2.4 llm-grop.mp4` |
| DKPrompt | `https://dkprompt.github.io/` | `https://dkprompt.github.io/assets/videos/DKPrompt-Video-Resized.mp4` as `dkprompt-source.mp4` | 80.0-163.0 s at 11.5x; failed effect check, replanning, execution, and explicit task success | `dkprompt.mp4` | `encode dkprompt-source.mp4 80 83 11.5 dkprompt.mp4` |
| OpenEQA | `https://open-eqa.github.io/` | `https://open-eqa.github.io/assets/videos/open-eqa-teaser.mp4` as `openeqa-source.mp4` | 0.0-20.0 s at 3x; first complete dynamic observation and question-answer sequence | `openeqa.mp4` | `encode openeqa-source.mp4 0 20 3 openeqa.mp4` |
| COWP | `https://cowplanning.github.io/` | `https://cowplanning.github.io/videos/demos/COWP_demo.mp4` as `cowp-source.mp4` | 75.0-145.0 s at 10x; object substitution, bowl delivery, and completion statement | `cowp.mp4` | `encode cowp-source.mp4 75 70 10 cowp.mp4` |
| Robotic Table Wiping | `https://arxiv.org/abs/2210.10865` | `https://www.youtube.com/watch?v=inORKP4F3EI` as `inORKP4F3EI.mp4` | 100.0-143.0 s at 6x; complete multimodal spill-wiping pass | `robotic-table-wiping.mp4` | `encode inORKP4F3EI.mp4 100 43 6 robotic-table-wiping.mp4` |
| GLAD | `https://yding25.com/proj/GLAD/index.html` | `https://www.youtube.com/watch?v=3T22B6tCYFA` as `3T22B6tCYFA.mp4` | 55.0-113.0 s at 8x; initial route, safety detection, replanning, and fulfilled request | `glad.mp4` | `encode 3T22B6tCYFA.mp4 55 58 8 glad.mp4` |
| SLAP | `https://robotslap.github.io/` | `https://robotslap.github.io/media/bring-me-my-bottle.mp4` as `slap-source.mp4` | 0.0-146.0 s at 20x; complete search, grasp, person search, and handover | `slap.mp4` | `encode slap-source.mp4 0 146 20 slap.mp4` |
| Symbolic State Space Optimization (S3O) | `https://sites.google.com/view/s3o` | Author-provided `ours_s3o.mp4`, copied into the source directory as `s3o-source.mp4` | 0.0-40.34 s at 5.5x; complete mobile-manipulation sequence including approach, pickup, navigation, and final placement | `s3o.mp4` | `encode s3o-source.mp4 0 40.34 5.5 s3o.mp4` |
| Multimodal Embodied Attribute Learning | `https://sites.google.com/view/attribute-learning-robotics/` | `https://www.youtube.com/watch?v=-E6wd3E1fMQ` as `-E6wd3E1fMQ.mp4` | 58.5-100.5 s at 6x; complete look, grasp, lift, shake, and successful classification trial | `meal.mp4` | `encode -E6wd3E1fMQ.mp4 58.5 42 6 meal.mp4` |
| Learning to Ground Objects / TMOC | `https://yding25.com/proj/TMOC/TMOC.html` | `https://www.youtube.com/watch?v=3ijtbbeCQho` as `3ijtbbeCQho.mp4` | 40.0-61.5 s at 3x; complete learned-plan comparison and measured outcome | `tmoc.mp4` | `encode 3ijtbbeCQho.mp4 40 21.5 3 tmoc.mp4` |
| 360-Vision Attention Guidance | `https://arxiv.org/abs/2109.10385` | `https://www.youtube.com/watch?v=aGbTxCGJSDM` as `aGbTxCGJSDM.mp4` | 2.0-18.0 s at 2.4x; complete attention-guided target-search trial | `360-vision-attention.mp4` | `encode aGbTxCGJSDM.mp4 2 16 2.4 360-vision-attention.mp4` |
| Task-Motion Planning for Urban Driving | `https://yding25.com/TMPUD/website/TMPUD.html` | `https://www.youtube.com/watch?v=ftpGLnU4234` as `tmpud-source.mp4` | 5.5-18.5 s and 21.0-51.0 s at 6x; unsafe Plan A, replanning, and completed safe Plan B | `task-motion-planning-urban-driving.mp4` | `encode_pair tmpud-source.mp4 5.5 13 21 30 6 task-motion-planning-urban-driving.mp4` |

## Static Entries

The following publications deliberately retain their image thumbnails:

- Efficient Sim-to-Real Transfer of World-Action Models from Synthetic Priors:
  no attributable public project footage was found.
- Data-Efficient Multitask DAgger: no attributable public project footage was
  found.
- Symbol Grounding for Task and Motion Planning in Robotics: the dissertation
  has no standalone attributable teaser.
- LLM+P: no attributable public project footage was found.

## Encoding Limits

- H.264 MP4, `yuv420p`, fast-start
- 480 x 270 centered 16:9 crop
- 12 fps, no audio
- 6-8 seconds
- CRF 27 with the slow preset
- 600 KB maximum per file
- 8 MB maximum for all preview MP4s
