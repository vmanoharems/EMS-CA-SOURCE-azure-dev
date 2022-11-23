SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE FUNCTION [dbo].[convertcodes] (@stringdata varchar(400))
RETURNS varchar(400)
AS
BEGIN 
Declare @TransString varchar(30)
declare @OutputString varchar(400)
declare @transcodeid varchar(30)
declare @transvalueid varchar(30)
declare @transcode varchar(30)
declare @transvalue varchar(10)
declare @OutputString1 varchar(400)
       

set @OutputString='';

Declare Cur Cursor Local Scroll For
select items from dbo.SplitId(@stringdata,',')
Open Cur
fetch next from Cur into @TransString

While @@FETCH_STATUS=0
Begin 


SELECT @transcodeid=SUBSTRING(@TransString,0, CHARINDEX(':',@TransString))
SELECT @transvalueid=RIGHT(@TransString,LEN(@TransString)-CHARINDEX(':',@TransString))
select @transcode=TransCode  from TransactionCode  where TransactionCodeID=@transcodeid
select @transvalue=TransValue  from TransactionValue  where TransactionValueID=@transvalueid

set @OutputString1=@transcode +':'+@transvalue+':'+@transvalueid

if(@OutputString1='')
begin
--set @OutputString1=@OutputString1;
set @OutputString1='';
end
else
begin
set @OutputString=@OutputString+','+ @OutputString1

end
fetch next from Cur into @TransString

End
close Cur
Deallocate Cur
set @OutputString=RIGHT(@OutputString,LEN(@OutputString)-CHARINDEX(',',@OutputString))
RETURN(@OutputString)
END
GO