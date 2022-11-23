SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE FUNCTION [dbo].[convertcodesJE] 
(@stringdata varchar(50))
RETURNS varchar(50)
AS
BEGIN 
Declare @TransString varchar(10)
declare @OutputString varchar(50)
declare @transcodeid varchar(10)
declare @transvalueid varchar(10)
declare @transcode varchar(10)
declare @transvalue varchar(10)
declare @OutputString1 varchar(50)
       

set @OutputString='';

Declare Cur Cursor Local Scroll For
select items from dbo.SplitId(@stringdata,',')
Open Cur
fetch next from Cur into @TransString

While @@FETCH_STATUS=0
Begin 


SELECT @transcodeid=SUBSTRING(@TransString,0, CHARINDEX(':',@TransString))
SELECT @transvalueid=RIGHT(@TransString,LEN(@TransString)-CHARINDEX(':',@TransString))

if EXISTS(select * from TransactionValue where TransactionCodeID=@transcodeid and TransValue=@transvalueid)
begin

select @transvalue=TransactionValueID from TransactionValue where TransactionCodeID=@transcodeid and TransValue=@transvalueid


set @OutputString1=@transcodeid +':'+@transvalue

if(@OutputString1='')
begin
--set @OutputString1=@OutputString1;
set @OutputString1='';
end
else
begin
set @OutputString=@OutputString+','+ @OutputString1

end


end



--end

fetch next from Cur into @TransString

End
close Cur
Deallocate Cur
set @OutputString=RIGHT(@OutputString1,LEN(@OutputString1)-CHARINDEX(',',@OutputString1))

--set @OutputString=substring(@OutputString, 1, (len(@OutputString) - 1))
RETURN(@OutputString)
END
GO