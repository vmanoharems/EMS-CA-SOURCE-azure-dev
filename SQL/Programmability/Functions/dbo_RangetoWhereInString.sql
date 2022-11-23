SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE FUNCTION [dbo].[RangetoWhereInString]
(	
	-- Add the parameters for the function here
	@starting int,
	@ending int 
)
RETURNS nvarchar(1000)
AS
Begin
	declare @return nvarchar(1000)=cast(@starting as nvarchar(1000));
	declare @count int=@starting+1;


	while @count <= @ending
	Begin
		set @return = @return + ',' + cast(@count as nvarchar(1000));
		set @count = @count + 1;
	End

	return @return;
end 
GO